<template>
  <div
    class="word"
    :class="{ selected: selectedWord, parent, child }"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <span class="text">{{ word.value }}</span>
    <span v-if="showLemma" class="lemma">{{
      valueIsh(word.lemma) || '-'
    }}</span>
    <span v-if="showGloss" class="gloss">{{
      valueIsh(word.gloss) || '-'
    }}</span>
    <span v-if="showRelationship" class="pos">{{
      valueIsh(word.relation) || '-'
    }}</span>
    <span v-if="showTag" class="analysis">{{ valueIsh(word.tag) || '-' }}</span>
  </div>
</template>

<script>
  import { MODULE_NS } from '@scaife-viewer/store';

  const ONLY_SHOW_ON_HOVER = false;

  export default {
    props: ['word', 'selected'],
    computed: {
      selectedWord() {
        return this.word.id === this.selected.word;
      },
      parent() {
        return this.word.id === this.selected.parent;
      },
      child() {
        return (this.selected.children || []).indexOf(this.word.id) > -1;
      },
      showAttrs() {
        if (ONLY_SHOW_ON_HOVER) {
          return this.selectedWord;
        }
        return true;
      },
      showRelationship() {
        return this.$store.state[MODULE_NS].showRelationship;
      },
      showTag() {
        return this.$store.state[MODULE_NS].showTag;
      },
      showLemma() {
        return this.$store.state[MODULE_NS].showLemma;
      },
      showGloss() {
        return this.$store.state[MODULE_NS].showGloss;
      },
    },
    methods: {
      onEnter() {
        this.$emit('word-enter', this.word);
      },
      onLeave() {
        this.$emit('word-leave', this.word);
      },
      valueIsh(value) {
        // TODO: Determine if the value is even available in the dataset
        if (this.showAttrs) {
          return value;
        }
        // NOTE: Return an empty character so we maintain height with
        // the selected word; might be able to tweak this ikn CSS
        return '‎';
      },
    },
  };
</script>

<style lang="scss" scoped>
  $interlinear-font-family: 'Lucida Console', Monaco, monospace;
  .parent,
  .child {
    color: var(--sv-reader-syntax-trees-mode-involved-text-color, #000);
  }
  .selected {
    color: var(--sv-reader-syntax-trees-mode-highlight-text-color, #d44);
    background: var(
      --sv-reader-syntax-trees-mode-highlight-background-color,
      #fea
    );
    padding: 2px 3px 0 3px;
    margin: -2px -3px 0 -3px;
    border-bottom: 3px solid
      var(--sv-reader-syntax-trees-mode-highlight-text-color, #d44);
  }
  .parent {
    border-bottom: 3px solid
      var(--sv-reader-syntax-trees-mode-parent-border-color, #66f);
  }
  .child {
    border-bottom: 3px solid
      var(--sv-reader-syntax-trees-mode-child-border-color, #3c3);
  }
  // TODO: Encapsulate these styles with interlinear display mode
  .word {
    display: inline-block;
    // TODO: Review these interlinear styles with @jtauber
    padding: 2px 4px;
    margin: 0 4px 10px;
    > span {
      display: block;
    }
    &:not(.selected, .child, .parent) {
      border-bottom: 3px solid transparent;
    }
    // TODO: Ref vs id
    // .ref {
    //   font-family: var(
    //     --sv-reader-syntax-trees-mode-ref-font-family,
    //     $interlinear-font-family
    //   );
    //   font-size: 0.55em;
    //   color: var(--sv-reader-syntax-trees-mode-ref-text-color, #999);
    // }
    .text {
      font-size: 1em;
      font-weight: 700;
      color: var(--sv-reader-syntax-trees-mode-text-color, #000);
    }
    .lemma {
      font-size: 0.88em;
      color: var(--sv-reader-syntax-trees-mode-lemma-text-color, #333);
    }
    // TODO: pos vs relationship
    .pos {
      font-size: 0.77em;
      color: var(--sv-reader-syntax-trees-mode-pos-text-color, #999);
    }
    .analysis {
      font-family: var(
        --sv-reader-syntax-trees-mode-analysis-font-family,
        $interlinear-font-family
      );
      font-size: 0.66em;
      color: var(--sv-reader-syntax-trees-mode-analysis-text-color, #999);
    }
    .gloss {
      font-size: 0.88em;
      color: var(--sv-reader-syntax-trees-mode-gloss-text-color, #333);
      font-style: italic;
    }
  }
</style>
