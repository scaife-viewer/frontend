<template>
  <div class="tree">
    <div class="citation">{{ tree.citation }}</div>
    <Sentence
      :words="tree.words"
      :selected="selected"
      @word-enter="onWordEnter"
      @word-leave="onWordLeave"
    />
    <div class="collapse-control">
      <a href @click.prevent="onCollapse">{{
        collapsed ? 'Show Tree' : 'Hide Tree'
      }}</a>
    </div>
    <Treant
      v-if="!collapsed"
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

  import Sentence from './Sentence.vue';

  export default {
    props: ['tree', 'expanded', 'first'],
    components: {
      Sentence,
      Treant,
    },
    data() {
      return {
        hoveringOn: null,
        collapsed: true,
      };
    },
    watch: {
      first: {
        immediate: true,
        handler() {
          if (this.first && this.expanded === null) {
            this.collapsed = false;
          }
        },
      },
      expanded: {
        immediate: true,
        handler() {
          if (this.expanded !== null && this.collapsed === this.expanded) {
            this.collapsed = !this.expanded;
          }
        },
      },
    },
    methods: {
      onCollapse() {
        this.collapsed = !this.collapsed;
        this.$emit('collapsed');
      },
      onWordEnter({ id }) {
        this.hoveringOn = id;
      },
      onWordLeave() {
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
        return this.tree.words.reduce(
          (map, word) => ({
            ...map,
            [word.id]: word,
          }),
          {},
        );
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
        const {
          rightOpen,
          leftOpen,
          leftVisible,
          rightVisible,
        } = this.$store.state[MODULE_NS];
        return `${rightOpen}-${leftOpen}-${leftVisible}-${rightVisible}`;
      },
    },
  };
</script>

<style lang="scss" scoped>
  // TODO: factor this out
  $interlinear-font-family: 'Lucida Console', Monaco, monospace;
  .tree {
    margin-bottom: 20px;
    .collapse-control {
      font-size: 80%;
    }
    .citation {
      text-align: center;
      font-size: 12pt;
      color: var(--sv-reader-syntax-tree-node-refs-text-color, #69c);
      font-family: 'Noto Sans';
      margin-bottom: 5px;
    }
  }
  .syntax-tree::v-deep {
    .node.highlight .node-attrs {
      color: var(--sv-reader-syntax-trees-mode-highlight-text-color, #d44);
      background: var(
        --sv-reader-syntax-trees-mode-highlight-background-color,
        #fea
      );
      border-color: var(
        --sv-reader-syntax-trees-mode-highlight-text-color,
        #d44
      );
    }

    .node-attrs {
      margin-bottom: 20px;
      border-bottom: 3px solid transparent;
      // TODO: pt vs px, overall size
      font-size: 16pt;
      line-height: 1.8em;
      > div {
        margin-bottom: 0;
      }
    }
    .node.highlight-parent {
      color: var(--sv-reader-syntax-trees-mode-parent-border-color, #66f);
    }
    .node.highlight-child {
      color: var(--sv-reader-syntax-trees-mode-child-border-color, #3c3);
    }
    .node-relation {
      color: var(--sv-reader-syntax-tree-node-relation-text-color, #aaa);
      margin-bottom: 0;
      margin-top: 2px;
      font-size: 10pt;
    }
    .node-value {
      margin-top: 0;
      font-size: 1em;
      font-family: var(--widget-reader-text-font-family, 'Noto Serif');
    }
    .node-lemma {
      font-size: 0.88em;
      color: var(--sv-reader-syntax-tree-node-lemma-text-color, #aaa);
    }
    .node-gloss {
      font-size: 0.88em;
      color: var(--sv-reader-syntax-tree-node-gloss-text-color, #aaa);
      font-style: italic;
    }
    .node-tag {
      font-family: var(
        --sv-reader-syntax-trees-node-tag-font-family,
        $interlinear-font-family
      );
      font-size: 0.66em;
      color: var(--sv-reader-syntax-trees-node-tag-text-color, #999);
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
      border-color: var(
        --sv-reader-syntax-tree-node-collapse-open-border-color,
        #aaa
      );
      &:hover {
        border-color: var(
          --sv-reader-syntax-tree-node-collapse-open-hover-border-color,
          #999
        );
        background-color: var(
          --sv-reader-syntax-tree-node-collapse-open-hover-background-color,
          #eee
        );
      }
    }
    .collapsed .collapse-switch {
      background: unset;
      border-color: var(
        --sv-reader-syntax-tree-node-collapse-closed-border-color,
        #5394ca
      );
      background-color: var(
        --sv-reader-syntax-tree-node-collapse-closed-background-color,
        #6bf
      );

      &:hover {
        border-color: var(
          --sv-reader-syntax-tree-node-collapse-closed-hover-border-color,
          #999
        );
        background-color: var(
          --sv-reader-syntax-tree-node-collapse-closed-hover-border-color,
          unset
        );
      }
    }
  }
</style>
