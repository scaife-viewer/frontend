<template>
  <ApolloQuery
    class="reader"
    :query="query"
    :variables="queryVariablesPlus"
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

  import { MODE_EXPAND } from './constants';
  import ModeToolbar from './ModeToolbar.vue';
  import Tree from './Tree.vue';

  const transformForTreant = node => {
    const text =
      node.value === null
        ? { name: '' }
        : { name: node.relation, desc: node.value, id: node.id };

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
            urn: tree.node.urn,
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
      isIliadGreek() {
        const urn = new URN(this.queryVariables.urn);
        return urn.version === 'urn:cts:greekLit:tlg0012.tlg001.perseus-grc2:';
      },
      collectionUrn() {
        // TODO:Remove hardcoded value
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
    height: 600px;
    max-height: calc(100vh - 100px);
  }
</style>
