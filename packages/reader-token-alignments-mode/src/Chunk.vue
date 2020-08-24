<template>
  <span class="chunk" :class="`a${number}`" @mouseover="onOver" @mouseout="onOut"></span>
</template>

<script>
  export default {
    props: ['chunk', 'number'],
    methods: {
      onOut() {
        this.$emit('hovered', null);
      },
      onOver() {
        this.$emit('hovered', this.chunk, this.number);
      },
    },
  }
</script>

<style lang="scss" scoped>
  .chunk {
    display: inline-block;
    width: 20px;
    height: 8px;
    border-radius: 2px;
    margin-right: 4px;
    &:last-child {
      margin-right: 0;
    }
  }
  .a0 {
    background-color: var(--sv-reader-token-alignments-mode-chunk-a0-color, #F00);
  }
  .a1 {
    background-color: var(--sv-reader-token-alignments-mode-chunk-a1-color, #0C0);
  }
  .a2 {
    background-color: var(--sv-reader-token-alignments-mode-chunk-a2-color, #00F);
  }
</style>
