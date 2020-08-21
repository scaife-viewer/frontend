<template>
  <span class="token" :class="{ selected }">
    {{ token.wordValue }}
    <span class="alignments-container">
      <span
        v-for="(alignment, index) in token.tokenAlignments"
        :key="index"
        :class="`a${index}`"
         @mouseover="onHover(alignment)"
      >&#x2B24;</span>
    </span>
  </span>
</template>

<script>
  export default {
    props: ['token', 'hoveringOn'],
    methods: {
      onHover(alignment) {
        this.$emit('hovered', alignment);
      }
    },
    computed: {
      selected() {
        return this.hoveringOn && this.hoveringOn.indexOf(this.token.id) > -1;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .token:hover > .alignments-container {
    display: block;
    opacity: 1;
  }
  .token.selected {
    color: #F00;
  }
  .alignments-container {
    font-size: 10pt;
    display: block;
    opacity: 0;
    color: transparent;
    cursor: pointer;

    .a0 {
      color: #F00;
    }
    .a1 {
      color: #0C0;
    }
    .a2 {
      color: #00F;
    }
  }
</style>
