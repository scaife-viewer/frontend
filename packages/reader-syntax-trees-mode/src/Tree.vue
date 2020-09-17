<template>
  <div class="tree">
    <Sentence
      v-if="showBoth || showTextOnly"
      :words="tree.words"
      :selected="selected"
      @word-enter="onWordEnter"
      @word-leave="onWordLeave"
    />
    <Treant
      v-if="showBoth || showGraphOnly"
      class="syntax-tree"
      :redrawKey="sideBarState"
      :treeBankId="tree.treeBankId"
      :tree="tree.tree"
      :highlighted="selected"
      @enter="onEnter"
      @leave="onLeave"
    />
  </div>
</template>

<script>
  import Treant from '@scaife-viewer/vue-treant';
  import { MODULE_NS } from '@scaife-viewer/store';

  import {
    SYNTAX_TREES_STATE_BOTH,
    SYNTAX_TREES_STATE_GRAPH,
    SYNTAX_TREES_STATE_TEXT,
  } from './constants';
  import Sentence from './Sentence.vue';

  export default {
    props: ['tree', 'showing'],
    components: {
      Sentence,
      Treant,
    },
    data() {
      return {
        hoveringOn: null,
      };
    },
    methods: {
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
    },
    computed: {
      selected() {
        return {
          word: this.hoveringOn,
          parent: this.selectedParent,
          children: this.selectedChildren,
        };
      },
      wordIndex() {
        return this.tree.words.reduce((map, word) => ({
          ...map,
          [word.id]: word,
        }), {});
      },
      selectedWord() {
        return this.wordIndex[this.hoveringOn];
      },
      selectedChildren() {
        return this.selectedWord && this.selectedWord.children.map(c => c.id);
      },
      selectedParent() {
        return this.selectedWord && this.selectedWord.headId;
      },
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
    }
  }
</script>

<style lang="scss" scoped>
  .syntax-tree::v-deep {
    .node.highlight .node-desc {
      color: var(--sv-reader-syntax-trees-mode-highlight-text-color, #D44);
      background: var(--sv-reader-syntax-trees-mode-highlight-background-color, #FEA);
      border-color: var(--sv-reader-syntax-trees-mode-highlight-text-color, #D44);

    }

    .node.highlight-parent {
      color: var(--sv-reader-syntax-trees-mode-parent-border-color, #66F);
    }
    .node.highlight-child {
      color: var(--sv-reader-syntax-trees-mode-child-border-color, #3C3);
    }
    .node-name {
      color: var(--sv-reader-syntax-tree-node-relation-text-color, #AAA);
      margin-bottom: 0;
      margin-top: 2px;
      font-size: 10pt;
    }
    .node-desc {
      margin-top: 0;
      margin-bottom: 20px;
      font-size: 16pt;
      border-bottom: 3px solid transparent;
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
