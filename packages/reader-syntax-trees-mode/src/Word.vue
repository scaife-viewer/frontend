<template>
  <span class="word" :class="{ selected }" @mouseenter="onEnter" @mouseleave="onLeave">{{ word.value }}</span>
</template>

<script>
  export default {
    props: ['word', 'hoveringOn'],
    computed: {
      selected() {
        return this.word.id === this.hoveringOn;
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
  .word.selected {
    color: var(--sv-reader-syntax-trees-mode-highlight-text-color, #F66);
  }
</style>
