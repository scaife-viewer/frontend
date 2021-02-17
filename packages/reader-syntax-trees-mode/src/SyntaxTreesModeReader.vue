<template>
  <ApolloQuery
    class="reader"
    ref="treesQuery"
    :query="query"
    :variables="queryVariables"
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
          @collapsed="expandAll = null"
        />
      </template>
    </template>
  </ApolloQuery>
</template>

<script>
  import gql from 'graphql-tag';
  import { ApolloQuery } from 'vue-apollo';

  import {
    LoaderBall,
    ErrorMessage,
    EmptyMessage,
  } from '@scaife-viewer/common';

  import { MODULE_NS } from '@scaife-viewer/store';

  import { MODE_EXPAND } from './constants';
  import ModeToolbar from './ModeToolbar.vue';
  import Tree from './Tree.vue';
  const generateNodeHTML = function(node, options) {
    if (node.value === null) {
      return null;
    }
    // TODO: the equivalent of `render_to_string` for Vue
    const parts = Array();
    if (options.showRelationship) {
      parts.push(`<div class="node-relation">${node.relation}</div>`);
    }
    parts.push('<div class="node-attrs">');
    parts.push(`<div class="node-value">${node.value}</div>`);
    if (options.showLemma) {
      parts.push(`<div class="node-lemma">${node.lemma}</div>`);
    }
    if (options.showGloss) {
      parts.push(`<div class="node-gloss">${node.gloss}</div>`);
    }
    if (options.showTag) {
      parts.push(`<div class="node-tag">${node.tag}</div>`);
    }
    parts.push(`</div><div class="node-id">${node.id}</div>`);
    return parts.join('\n');
  };
  const transformForTreant = function(node, options) {
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
      textWidth: 'wide',
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
          };
        });

        this.$data.trees = trees;
      },
    },
    computed: {
      displayOptions() {
        return {
          showLemma: this.$store.state[MODULE_NS].showLemma,
          showGloss: this.$store.state[MODULE_NS].showGloss,
          showTag: this.$store.state[MODULE_NS].showTag,
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
      query() {
        return gql`
          query SyntaxTree($urn: String!) {
            syntaxTrees(reference: $urn) {
              edges {
                node {
                  id
                  data
                }
              }
            }
          }
        `;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .reader {
    width: 100%;
    height: 600px;
    max-height: calc(100vh - 100px);
  }
</style>
