<template>
  <ApolloQuery
    class="reader"
    ref="treesQuery"
    :query="query"
    :variables="queryVariablesPlus"
    :update="queryUpdate"
  >
    <template v-slot="{ result: { error }, isLoading }">
      <LoaderBall v-if="isLoading" />
      <ErrorMessage v-else-if="error">
        There was an error loading the requested data.
      </ErrorMessage>
      <EmptyMessage v-else-if="trees.length === 0" />
      <template v-else>
        <ModeToolbar :expandAll="expandAll" @show="onShow" />
        <Tree
          v-for="(tree, index) in trees"
          :key="tree.treeBankId"
          :tree="tree"
          :first="index === 0"
          :expanded="expanded"
          @tree-collapsed="expandAll = null"
        />
      </template>
    </template>
  </ApolloQuery>
</template>

<script>
  import gql from 'graphql-tag';
  import { ApolloQuery } from 'vue-apollo';

  import URN, {
    LoaderBall,
    ErrorMessage,
    EmptyMessage,
  } from '@scaife-viewer/common';

  import {
    MODULE_NS,
    LAYOUT_WIDTH_WIDE,
    SHOW_TRANSLITERATION,
    SHOW_LEMMA,
    SHOW_RELATIONSHIP,
    SHOW_MORPH_TAG,
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
        [SHOW_GLOSS]: false,
      },
    },
    data() {
      return {
        trees: [],
      };
    },
    components: {
      ApolloQuery,
      LoaderBall,
      ErrorMessage,
      EmptyMessage,
      ModeToolbar,
      Tree,
    },
    props: {
      queryVariables: Object,
    },
    watch: {
      displayOptions: {
        handler() {
          this.queryUpdate(this.$refs.treesQuery.result.fullData);
        },
      },
    },
    methods: {
      onShow(expandAll) {
        this.expandAll = expandAll;
      },
      queryUpdate(data) {
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
          });
          return {
            tree: transformForTreant(root, this.displayOptions),
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

        this.$data.trees = trees;
      },
    },
    computed: {
      displayOptions() {
        return {
          showTransliteration: this.$store.state[MODULE_NS].showTransliteration,
          showLemma: this.$store.state[MODULE_NS].showLemma,
          showGloss: this.hasGlosses && this.$store.state[MODULE_NS].showGloss,
          showMorphTag: this.$store.state[MODULE_NS][SHOW_MORPH_TAG],
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
      passage() {
        // TODO: passage
        return new URN(this.queryVariables.urn);
      },
      isIliadGreek() {
        return (
          this.passage.version ===
          'urn:cts:greekLit:tlg0012.tlg001.perseus-grc2:'
        );
      },
      hasGlosses() {
        return this.passage.textGroup === 'tlg0012';
      },
      collectionUrn() {
        // TODO:Remove hardcoded value and expose a dropdown, similar to
        // translation alignments
        return this.isIliadGreek
          ? // eslint-disable-next-line max-len
            `urn:cite2:beyond-translation:text_annotation_collection.atlas_v1:il_gregorycrane_gAGDT`
          : '';
      },
      // TODO: Refactor `queryVariables` prop
      standardQuery() {
        return gql`
          query SyntaxTree($urn: String!) {
            syntaxTrees(reference: $urn) {
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
        return this.queryVariables;
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
        return this.isIliadGreek
          ? this.specialVariables
          : this.standardVariables;
      },
      query() {
        return this.isIliadGreek ? this.specialQuery : this.standardQuery;
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
</style>
