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
      <template v-else>
        <div class="sentence">
          <span v-for="word in data.words" :key="word.id" :class="{ selected: selected(word) }" class="word">
            {{ word.value }}
          </span>
        </div>
        <Treant class="syntax-tree" :tree="data.tree" @enter="onEnter" @leave="onLeave" />
      </template>
    </template>
  </ApolloQuery>
</template>

<script>
  import gql from 'graphql-tag';
  import { ApolloQuery } from 'vue-apollo';

  import { LoaderBall, ErrorMessage, EmptyMessage } from '@scaife-viewer/common';

  import Treant from './Treant.vue';

  const transformForTreant = node => {
    const text = node.value === null
      ? { name: 'Root' }
      : { name: node.relation, desc: node.value, id: node.id};

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
    components: { ApolloQuery, LoaderBall, ErrorMessage, EmptyMessage, Treant },
    props: {
      queryVariables: Object
    },
    data() {
      return {
        hoveringOn: null,
      };
    },
    methods: {
      onEnter({ id }) {
        this.hoveringOn = id;
      },
      onLeave() {
        this.hoveringOn = null;
      },
      selected(word) {
        return word.id === this.hoveringOn;
      },
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
          tree: transformForTreant(tree)
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
    height: 600px;
    max-height: calc(100vh - 100px);
  }

  .tree {
    height: 100%;
    width: 100%;
  }
  .popover-relation {
    background: var(--sv-reader-syntax-trees-mode-relation-popover-background-color, #FFF);
    border: 1px solid var(--sv-reader-syntax-trees-mode-relation-popover-border-color, #DDD);
    border-radius: 3px;
    padding: 0.25rem 0.5rem;
    font-size: 12px;
  }
  .word.selected {
    color: red;
  }
  .syntax-tree::v-deep {
    .node-name {
      color: var(--sv-reader-syntax-tree-node-relation-text-color, #AAA);
      margin-bottom: 0;
    }
    .node-desc {
      margin-top: 0;
    }
    .node {
      text-align: center;
    }
    .collapse-switch {
      width: 15px;
      height: 15px;
      line-height: 1;
      right: calc(50% - 7.5px);
      color: unset;
      border-radius: 15px;
      border-color: var(--sv-reader-syntax-tree-node-collapse-open-border-color, #AAA);
      &:hover {
        border-color: var(--sv-reader-syntax-tree-node-collapse-open-hover-border-color, #999);
        background-color: var(--sv-reader-syntax-tree-node-collapse-open-hover-background-color, #EEE);
      }
    }
    .collapsed .collapse-switch {
      background: unset;
      border-color: var(--sv-reader-syntax-tree-node-collapse-closed-border-color, #5394ca);
      background-color: var(--sv-reader-syntax-tree-node-collapse-closed-background-color, #6BF);

      &:hover {
        border-color: var(--sv-reader-syntax-tree-node-collapse-closed-hover-border-color, #999);
        background-color: var(--sv-reader-syntax-tree-node-collapse-closed-hover-border-color, unset);
      }
    }
  }
</style>
