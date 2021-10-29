<template>
  <span
    class="word"
    :class="{ selected: selectedWord, parent, child }"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    >{{ word.value }}</span
  >
</template>

<script>
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
</style>
