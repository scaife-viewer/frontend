<template>
  <div
    class="word"
    :class="{ selected: selectedWord, parent, child }"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <div class="text">{{ word.value }}</div>
    <div v-if="showLemma" class="lemma">{{ word.lemma || '-' }}</div>
    <div v-if="showRelationship" class="pos">
      {{ word.relation || '-' }}
    </div>
    <div v-if="showTag" class="analysis">{{ word.tag || '-' }}</div>
    <template v-if="hasGlosses">
      <div v-if="showGloss" class="gloss">{{ word.glossEng || '-' }}</div>
      <div v-if="showGloss" class="gloss gloss-rtl">
        {{ word.glossFas || '-' }}
      </div>
    </template>
  </div>
</template>

<script>
  import { MODULE_NS } from '@scaife-viewer/store';

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
      passage() {
        return this.$store.getters[`${MODULE_NS}/passage`];
      },
      hasGlosses() {
        return this.passage.textGroup === 'tlg0012';
      },
    },
    methods: {
      onEnter() {
        this.$emit('word-enter', this.word);
      },
      onLeave() {
        this.$emit('word-leave', this.word);
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
    display: table-cell;
    // TODO: Review these interlinear styles with @jtauber
    padding: 2px 4px;
    margin: 0 4px 10px;
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
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 20ch;
    }
    .gloss-rtl {
      direction: rtl;
      font-family: var(
        --sv-reader-syntax-trees-mode-gloss-font-family-rtl,
        'Amiri',
        'Noto Sans'
      );
      font-style: initial;
      font-size: 24px;
      line-height: 1.7;
      margin-inline-start: 1em;
    }
  }
  .word:not(.selected):not(.child):not(.parent) {
    border-bottom: 3px solid transparent;
  }
</style>
