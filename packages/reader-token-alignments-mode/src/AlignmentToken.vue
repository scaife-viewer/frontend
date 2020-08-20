<template>
  <span class="token">
    {{ token.wordValue }}
    <span class="alignments-container">
      <span v-for="(alignment, index) in token.tokenAlignments" :key="alignment" :class="`a${index}`">&#x2B24;</span>
    </span>
  </span>
</template>

<script>
  export default {
    props: ['token'],
  }
</script>

<style lang="scss" scoped>
  .token:hover > .alignments-container {
    display: block;
   // opacity: 1;
  }
  .alignments-container {
    font-size: 10pt;
    display: block;
   //  opacity: 0;
    color: transparent;
    cursor: pointer;

    .a0 {
      color: black;
    }
    .a1 {
      color: #F00;
    }
    .a2 {
      color: #0C0;
    }
    .a3 {
      color: #00F;
    }
  }
</style>
