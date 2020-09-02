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
      <EmptyMessage v-else-if="!data" />
      <tree  v-else class="tree" :data="data.tree" node-text="value" layoutType="vertical" />
    </template>
  </ApolloQuery>
</template>

<script>
  import gql from 'graphql-tag';
  import { ApolloQuery } from 'vue-apollo';
  import { tree } from 'vued3tree';

  import { LoaderBall, ErrorMessage, EmptyMessage } from '@scaife-viewer/common';

  export default {
    readerConfig: {
      label: 'Syntax Trees',
      textWidth: 'wide',
    },
    components: { tree, ApolloQuery, LoaderBall, ErrorMessage, EmptyMessage },
    props: {
      queryVariables: Object
    },
    methods: {
      queryUpdate(data) {
        const words = data.textAnnotations.edges
          .map(e => e.node.data.words.map(word => {
            return {
              ...word,
              children: [],
            }
          })).flat();
        const wordBank = words.reduce((map, word) => {
          return {
            ...map,
            [word.id]: word,
          };
        }, {});
        const tree = {id: 0, value: null, headId: null, relation: null, children: []};

        words.forEach(word => {
          if (word.headId === 0) {
            tree.children.push(word);
          } else {
            wordBank[word.headId].children.push(word);
          }
        });
        return {
          words,
          tree
        };
      },
    },
    computed: {
      query() {
        return gql`
          query SyntaxTree($urn: String!) {
            textAnnotations(reference: $urn, kind: "SYNTAX_TREE") {
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
    height: calc(100vh - 60px);
  }

  .tree {
    height: 100%;
    width: 100%;
  }
</style>
