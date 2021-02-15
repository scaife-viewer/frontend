<template>
  <ApolloQuery
    class="reader"
    :query="query"
    :variables="queryVariables"
    :update="queryUpdate"
  >
    <template v-slot="{ result: { error, data }, isLoading }">
      <LoaderBall v-if="isLoading" />
      <ErrorMessage v-else-if="error">
        There was an error loading the requested data.
      </ErrorMessage>
      <EmptyMessage
        v-else-if="!data || !data.trees || data.trees.length === 0"
      />
      <template v-else>
        <ModeToolbar :expandAll="expandAll" @show="onShow" />
        <Tree
          v-for="(tree, index) in data.trees"
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

  import { MODE_EXPAND } from './constants';
  import ModeToolbar from './ModeToolbar.vue';
  import Tree from './Tree.vue';

  const transformForTreant = node => {
    // TODO: Review https://fperucic.github.io/treant-js/#orgchart-api-node
    // for better control
    // TODO: the package on NPM https://www.npmjs.com/package/treant-js
    // has drifted from https://github.com/fperucic/treant-js
    let text = { name: '' };
    if (node.value != null) {
      text = {
        name: node.relation,
        desc: node.value,
        id: node.id,
        // 'data-lemma': node.lemma,
      };
    }
    return {
      text,
      children: node.children.map(child => transformForTreant(child)),
    };
  };

  export default {
    readerConfig: {
      label: 'Syntax Trees',
      textWidth: 'wide',
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
            tree: transformForTreant(root),
            words,
            wordBank,
            treeBankId: tree.node.data.treebankId,
            references: tree.node.data.references,
            citation: tree.node.data.citation,
          };
        });

        return {
          trees,
        };
      },
    },
    computed: {
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
