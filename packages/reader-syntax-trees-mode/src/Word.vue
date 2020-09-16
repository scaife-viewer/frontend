<template>
  <span class="word" :class="{ selected, parent, child }" @mouseenter="onEnter" @mouseleave="onLeave">{{ word.value }}</span>
</template>

<script>
  export default {
    props: ['word', 'selectedWord', 'selectedChildren', 'selectedParent'],
    computed: {
      selected() {
        return this.word.id === this.selectedWord;
      },
      parent() {
        return this.word.id === this.selectedParent;
      },
      child() {
        return (this.selectedChildren || []).indexOf(this.word.id) > -1;
      },
    },
    methods: {
      onEnter() {
        this.$emit('word-enter', this.word);
      },
      onLeave() {
        this.$emit('word-leave', this.word);
      },
    }
  }
</script>

<style lang="scss" scoped>
  .parent,
  .child {
    color: var(--sv-reader-syntax-trees-mode-involved-text-color, #000);
  }
  .selected {
    color: var(--sv-reader-syntax-trees-mode-highlight-text-color, #D44);
    background: var(--sv-reader-syntax-trees-mode-highlight-background-color, #FEA);
    padding: 2px 3px 0 3px;
    margin: -2px -3px 0 -3px;
    border-bottom: 3px solid var(--sv-reader-syntax-trees-mode-highlight-text-color, #D44);
  }
  .parent {
    border-bottom: 3px solid var(--sv-reader-syntax-trees-mode-parent-border-color, #66F);
  }
  .child {
    border-bottom: 3px solid var(--sv-reader-syntax-trees-mode-child-border-color, #4D4);
  }
</style>
