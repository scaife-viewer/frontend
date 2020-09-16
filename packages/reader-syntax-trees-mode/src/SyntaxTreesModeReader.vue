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
        <ModeToolbar :show="showing" @show="onShow" />
        <Sentence
          v-if="showBoth || showTextOnly"
          :words="data.words"
          :selected="hoveringOn"
          @word-enter="onWordEnter"
          @word-leave="onWordLeave"
        />
        <Treant
          v-if="showBoth || showGraphOnly"
          class="syntax-tree"
          :redrawKey="sideBarState"
          :tree="data.tree"
          :highlightedNode="hoveringOn"
          @enter="onEnter"
          @leave="onLeave"
        />
      </template>
    </template>
  </ApolloQuery>
</template>

<script>
  import gql from 'graphql-tag';
  import { ApolloQuery } from 'vue-apollo';

  import { LoaderBall, ErrorMessage, EmptyMessage } from '@scaife-viewer/common';
  import { MODULE_NS } from '@scaife-viewer/store';

  import Treant from '@scaife-viewer/vue-treant';

  import ModeToolbar from './ModeToolbar.vue';
  import Sentence from './Sentence.vue';
  import {
    SYNTAX_TREES_STATE_BOTH,
    SYNTAX_TREES_STATE_GRAPH,
    SYNTAX_TREES_STATE_TEXT,
  } from './constants';

  const transformForTreant = node => {
    const text = node.value === null
      ? { name: '' }
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
    components: {
      ApolloQuery,
      LoaderBall,
      ErrorMessage,
      EmptyMessage,
      Treant,
      ModeToolbar,
      Sentence,
    },
    props: {
      queryVariables: Object
    },
    data() {
      return {
        hoveringOn: null,
        showing: SYNTAX_TREES_STATE_BOTH,
      };
    },
    methods: {
      onShow(kind) {
        this.showing = kind;
      },
      onWordEnter({ id }) {
        this.hoveringOn = id;
      },
      onWordLeave(word) {
        this.hoveringOn = null;
      },
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
        const words = data.syntaxTrees.edges
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
      sideBarState() {
        const { rightOpen, leftOpen, leftVisible, rightVisible } = this.$store.state[MODULE_NS];
        return `${rightOpen}-${leftOpen}-${leftVisible}-${rightVisible}`;
      },
      showBoth() {
        return this.showing === SYNTAX_TREES_STATE_BOTH;
      },
      showTextOnly() {
        return this.showing === SYNTAX_TREES_STATE_TEXT;
      },
      showGraphOnly() {
        return this.showing === SYNTAX_TREES_STATE_GRAPH;
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
  .syntax-tree::v-deep {
    .node.highlight {
      color: var(--sv-reader-syntax-trees-mode-highlight-text-color, #D44);
    }
    .node-name {
      color: var(--sv-reader-syntax-tree-node-relation-text-color, #AAA);
      margin-bottom: 0;
      margin-top: 5px;
      font-size: 10pt;
    }
    .node-desc {
      margin-top: 0;
      margin-bottom: 20px;
      font-size: 16pt;
      font-family: var(--widget-reader-text-font-family, 'Noto Serif');
    }
    .node {
      text-align: center;
    }
    .collapse-switch {
      width: 15px;
      height: 15px;
      line-height: 1;
      bottom: 0;
      top: unset;
      right: calc(50% - 8px);
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
