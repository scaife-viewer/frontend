<template>
  <div class="reader">
    <LoaderBall v-if="$apollo.loading" />
    <ErrorMessage v-else-if="errors" />
    <template v-else-if="passageHasTrees">
      <div class="toolbar">
        <!-- TODO: Experiment with moving the toolbar into the toggles -->
        <CustomSelect
          v-model="selectedCollection"
          :options="treeCollections"
          placeholder="Select a collection..."
        />
      </div>
      <template v-if="trees && trees.length > 0">
        <ModeToolbar
          :expandAll="expandAll"
          :availableToggles="availableToggles"
          @show="onShow"
        />
        <Tree
          v-for="(tree, index) in transformedTrees"
          :key="tree.treeBankId"
          :tree="tree"
          :first="index === 0"
          :expanded="expanded"
          @tree-collapsed="expandAll = null"
        />
      </template>
    </template>
    <EmptyMessage v-else />
  </div>
</template>

<script>
  import gql from 'graphql-tag';

  import URN, {
    LoaderBall,
    ErrorMessage,
    EmptyMessage,
    CustomSelect,
    TOKEN_ANNOTATION_TOGGLES,
  } from '@scaife-viewer/common';

  import {
    MODULE_NS,
    LAYOUT_WIDTH_WIDE,
    SHOW_TRANSLITERATION,
    SHOW_LEMMA,
    SHOW_RELATIONSHIP,
    SHOW_MORPH_TAG,
    SHOW_GRAMMATICAL_TAGS,
    SHOW_GLOSS,
  } from '@scaife-viewer/store';

  import { MODE_EXPAND } from './constants';
  import ModeToolbar from './ModeToolbar.vue';
  import Tree from './Tree.vue';

  const generateNodeHTML = (node, options) => {
    if (node.value === null) {
      return null;
    }
    // TODO: the equivalent of `render_to_string` for Vue
    const parts = [];
    if (options.showRelationship) {
      parts.push(`<div class="node-relation">${node.relation}</div>`);
    }
    parts.push('<div class="node-attrs">');
    parts.push(`<div class="node-value">${node.value}</div>`);
    // TODO: Dynamic options for transliteratedWordValue
    // TODO: Timing on transliteration process
    if (options.showTransliteration) {
      parts.push(
        `<div class="node-transliteration">` +
          `${node.transliteratedWordValue}</div>`,
      );
    }
    if (options.showLemma) {
      parts.push(`<div class="node-lemma">${node.lemma}</div>`);
    }
    if (options.showMorphTag) {
      parts.push(`<div class="node-tag">${node.tag}</div>`);
    }
    if (options[SHOW_GRAMMATICAL_TAGS]) {
      const grammaticalTags = node.grammaticalTags
        ? node.grammaticalTags.join('|')
        : '-';
      parts.push(`<div class="node-tag">${grammaticalTags}</div>`);
    }
    if (options.showGloss) {
      parts.push(`<div class="node-gloss">${node.glossEng || '-'}</div>`);
      parts.push(
        `<div class="node-gloss node-gloss-rtl">${node.glossFas || '-'}</div>`,
      );
    }
    parts.push(`</div><div class="node-id">${node.id}</div>`);
    return parts.join('\n');
  };
  const transformForTreant = (node, options) => {
    const text = node.value != null ? { id: node.id } : {};
    return {
      text,
      innerHTML: generateNodeHTML(node, options),
      children: node.children.map(child => transformForTreant(child, options)),
    };
  };

  export default {
    readerConfig: {
      label: 'Syntax Trees',
      layout: LAYOUT_WIDTH_WIDE,
      textWidth: 'full',
      annotationDefaults: {
        [SHOW_TRANSLITERATION]: false,
        [SHOW_LEMMA]: false,
        [SHOW_RELATIONSHIP]: true,
        [SHOW_MORPH_TAG]: false,
        [SHOW_GRAMMATICAL_TAGS]: false,
        [SHOW_GLOSS]: false,
      },
    },
    data() {
      return {
        errors: false,
      };
    },
    components: {
      LoaderBall,
      ErrorMessage,
      EmptyMessage,
      CustomSelect,
      ModeToolbar,
      Tree,
    },
    props: {
      queryVariables: Object,
    },
    watch: {
      selectedCollection: {
        handler(value) {
          if (value && value.value !== this.collectionUrn) {
            this.collectionUrn = value.value;
          }
        },
      },
      treeCollections: {
        handler() {
          if (this.collectionUrn === undefined) {
            if (this.treeCollections.length > 0) {
              const value = this.treeCollections[0];
              const query = {
                ...this.$route.query,
                collectionUrn: value.value,
              };
              this.$router.replace({ query });
            }
          }
        },
      },
      metadata: {
        handler(newValue) {
          if (!newValue) {
            return;
          }
          [...TOKEN_ANNOTATION_TOGGLES].forEach(entry => {
            const [propertyName] = entry;
            let value = false;
            if (this.isAvailable(propertyName)) {
              value = this.$options.readerConfig.annotationDefaults[
                propertyName
              ];
            }
            this.$store.state[MODULE_NS][propertyName] = value;
          });
        },
        immediate: true,
      },
    },
    methods: {
      onShow(expandAll) {
        this.expandAll = expandAll;
      },
      extractGrammaticalTags(textPartEdges) {
        // TODO: Optimize when this query is invoked
        // TODO: Tighten up mapping by either
        // A) Tying tokens to words more explicitly upstream
        // B) Resolving words to to tokens using subrefs or
        // lemmas
        const tagsByRefWord = new Map();
        textPartEdges.forEach(textPartEdge => {
          textPartEdge.node.tokens.edges.forEach(tokenEdge => {
            const { veRef, wordValue } = tokenEdge.node;
            const ref = veRef.split('.t')[0];
            const key = `${ref}-${wordValue}`;
            tokenEdge.node.grammaticalEntries.edges.forEach(grammaticalEdge => {
              const { label } = grammaticalEdge.node;
              const lookupValue = tagsByRefWord.get(key) || [];
              lookupValue.push(label);
              tagsByRefWord.set(key, lookupValue);
            });
          });
        });
        return tagsByRefWord;
      },
      queryUpdate(data) {
        // NOTE: We are only invoking these for Iliad Greek
        // because we don't have any further grammars at this time.
        const grammaticalTagsByRefWord = this.isCustomCollection
          ? this.extractGrammaticalTags(data.passageTextParts.edges)
          : new Map();
        const trees = data.syntaxTrees.edges.map(tree => {
          const words = tree.node.data.words.map(word => ({
            ...word,
            children: [],
          }));
          const wordBank = words.reduce((map, word) => {
            return {
              ...map,
              [word.id]: word,
            };
          }, {});
          const root = {
            id: 0,
            value: null,
            headId: null,
            relation: null,
            children: [],
          };
          words.forEach(word => {
            if (word.headId === 0) {
              root.children.push(word);
            } else {
              wordBank[word.headId].children.push(word);
            }
            const subRefKey = `${word.ref}-${word.value}`;
            // eslint-disable-next-line no-param-reassign
            word.grammaticalTags =
              grammaticalTagsByRefWord.get(subRefKey) || null;
          });
          return {
            root,
            words,
            wordBank,
            treeBankId: tree.node.data.treebankId,
            references: tree.node.data.references,
            citation: tree.node.data.citation,
            translations: tree.node.data.translations,
            collectionId: tree.node.collection.id,
            urn: tree.node.urn,
          };
        });
        return trees;
      },
      isAvailable(propertyName) {
        if (propertyName === SHOW_TRANSLITERATION) {
          return this.metadata.lang === 'grc';
        }
        if (propertyName === SHOW_GRAMMATICAL_TAGS) {
          return this.passage.textGroup === 'tlg0012';
        }
        if (propertyName === SHOW_RELATIONSHIP) {
          // TODO: Consistency with field names
          return this.collectionFields
            ? this.collectionFields.morph
            : this.passage.nss === 'greekLit';
        }
        if (propertyName === SHOW_GLOSS) {
          return this.collectionFields
            ? this.collectionFields.gloss
            : this.passage.nss === 'greekLit';
        }
        return true;
      },
    },
    computed: {
      collectionFields() {
        if (!this.selectedCollection) {
          return {};
        }
        return this.selectedCollection.data.fields;
      },
      passageHasTrees() {
        return this.treeCollections && this.treeCollections.length > 0;
      },
      transformedTrees() {
        if (!this.trees) {
          return [];
        }
        return this.trees.map(tree => {
          return {
            ...tree,
            // NOTE: We need to "rebind" the tree here based on the selected
            // display options
            tree: transformForTreant(tree.root, this.displayOptions),
          };
        });
      },
      collectionUrn: {
        get() {
          return this.$route.query.collectionUrn;
        },
        set(value) {
          if (value === undefined) {
            return;
          }
          const query = {
            ...this.$route.query,
            collectionUrn: value,
          };
          this.$router.replace({ query });
        },
      },
      displayOptions() {
        return {
          showTransliteration: this.$store.state[MODULE_NS].showTransliteration,
          showLemma: this.$store.state[MODULE_NS].showLemma,
          showGloss: this.hasGlosses && this.$store.state[MODULE_NS].showGloss,
          showMorphTag: this.$store.state[MODULE_NS][SHOW_MORPH_TAG],
          [SHOW_GRAMMATICAL_TAGS]: this.$store.state[MODULE_NS][
            SHOW_GRAMMATICAL_TAGS
          ],
          showRelationship: this.$store.state[MODULE_NS].showRelationship,
        };
      },
      expanded() {
        return this.expandAll === null ? null : this.expandAll === MODE_EXPAND;
      },
      expandAll: {
        get() {
          return this.$route.query.rs === undefined
            ? null
            : this.$route.query.rs;
        },
        set(value) {
          if (value === undefined) {
            return;
          }
          if (value === this.$route.query.rs) {
            return;
          }
          const query = {
            ...this.$route.query,
            rs: value,
          };
          this.$router.replace({ query });
        },
      },
      metadata() {
        return this.$store.getters[`${MODULE_NS}/metadata`];
      },
      passage() {
        // TODO: passage
        return new URN(this.queryVariables.urn);
      },
      availableToggles() {
        const toggles = [...TOKEN_ANNOTATION_TOGGLES];
        return toggles.filter(entry => this.isAvailable(entry[0]));
      },
      isIliadGreek() {
        return (
          this.passage.version ===
          'urn:cts:greekLit:tlg0012.tlg001.perseus-grc2:'
        );
      },
      isCustomCollection() {
        return (
          this.isIliadGreek &&
          // eslint-disable-next-line max-len, prettier/prettier
          this.collectionUrn === 'urn:cite2:beyond-translation:text_annotation_collection.atlas_v1:il_gregorycrane_gAGDT'
        );
      },
      hasGlosses() {
        return this.passage.textGroup === 'tlg0012';
      },
      // TODO: Refactor `queryVariables` prop
      standardQuery() {
        return gql`
          query SyntaxTree($urn: String!, $collectionUrn: ID!) {
            syntaxTrees(reference: $urn, collection_Urn: $collectionUrn) {
              edges {
                node {
                  id
                  data
                  urn
                  collection {
                    id
                  }
                }
              }
            }
          }
        `;
      },
      standardVariables() {
        return {
          collectionUrn: this.collectionUrn,
          ...this.queryVariables,
        };
      },
      specialQuery() {
        return gql`
          query SyntaxTree($urn: String!, $collectionUrn: ID!) {
            syntaxTrees(reference: $urn, collection_Urn: $collectionUrn) {
              edges {
                node {
                  id
                  urn
                  data
                  collection {
                    id
                  }
                }
              }
            }
            passageTextParts(reference: $urn) {
              edges {
                node {
                  id
                  tokens {
                    edges {
                      node {
                        id
                        veRef
                        wordValue
                        grammaticalEntries {
                          edges {
                            node {
                              id
                              label
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `;
      },
      specialVariables() {
        return {
          collectionUrn: this.collectionUrn,
          ...this.queryVariables,
        };
      },
      queryVariablesPlus() {
        return this.isCustomCollection
          ? this.specialVariables
          : this.standardVariables;
      },
      query() {
        return this.isCustomCollection ? this.specialQuery : this.standardQuery;
      },
      skip() {
        return !this.collectionUrn;
      },
    },
    apollo: {
      trees: {
        query() {
          return this.query;
        },
        variables() {
          return this.queryVariablesPlus;
        },
        update(data) {
          return this.queryUpdate(data);
        },
        error() {
          this.errors = true;
        },
        skip() {
          return !this.collectionUrn;
        },
      },
      selectedCollection: {
        query: gql`
          query TreeCollections($urn: String!) {
            textAnnotationCollections(urn: $urn) {
              edges {
                node {
                  id
                  label
                  urn
                  data
                }
              }
            }
          }
        `,
        skip() {
          return !this.collectionUrn;
        },
        update(data) {
          return data.textAnnotationCollections.edges.map(e => {
            return {
              value: e.node.urn,
              title: e.node.label,
              data: e.node.data,
            };
          })[0];
        },
        variables() {
          return {
            urn: this.collectionUrn,
          };
        },
        error() {
          this.errors = true;
        },
      },
      // TODO: Allow this query to be scoped so we actually only get
      // tree collections
      treeCollections: {
        query: gql`
          query TreeCollections($urn: String!) {
            textAnnotationCollections(reference: $urn) {
              edges {
                node {
                  id
                  label
                  urn
                }
              }
            }
          }
        `,
        variables() {
          return this.queryVariables;
        },
        update(data) {
          return data.textAnnotationCollections.edges.map(e => {
            return {
              value: e.node.urn,
              title: e.node.label,
            };
          });
        },
        error() {
          this.errors = true;
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  .reader {
    width: 100%;
    margin: 0 1em;
    height: 600px;
    max-height: calc(100vh - 100px);
  }
  .toolbar {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 14px;
    margin-bottom: 1em;
  }
  .empty-annotations {
    text-align: center;
    margin-top: 1rem;
  }
</style>
