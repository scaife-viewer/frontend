<template>
  <span
    class="alignment-record"
    :class="`a${number}`"
    @mouseover="onOver"
    @mouseout="onOut"
  ></span>
</template>

<script>
  export default {
    props: ['record', 'number'],
    methods: {
      onOut() {
        this.$emit('hovered', null);
      },
      onOver() {
        this.$emit('hovered', this.record, this.number);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .alignment-record {
    display: inline-block;
    width: 20px;
    height: 8px;
    border-radius: 2px;
    margin-right: 4px;
    &:last-child {
      margin-right: 0;
    }
  }
  // TODO: Think through "groupings" to allow for consistent colors
  // TODO: Palette for color blindness cf. https://thenode.biologists.com/data-visualization-with-flying-colors/research/
  .a0 {
    // #0073b2
    background-color: var(
      --sv-reader-token-alignments-mode-alignment-record-a0-color,
      #f00
    );
  }
  .a1 {
    // #d55d00
    background-color: var(
      --sv-reader-token-alignments-mode-alignment-record-a1-color,
      #0c0
    );
  }
  .a2 {
    // #019e73
    background-color: var(
      --sv-reader-token-alignments-mode-alignment-record-a2-color,
      #00f
    );
  }
</style>
