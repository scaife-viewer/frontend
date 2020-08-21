<template>
  <span class="alignments-picker">
    <Chunk
      v-for="(chunk, index) in chunks" :key="chunk"
      :chunk="chunk"
      :number="index"
      @hovered="onHover"
    />
  </span>
</template>

<script>
  import Chunk from './Chunk.vue';

  export default {
    props: ['chunks'],
    components: { Chunk },
    methods: {
      onHover(chunk, number) {
        this.$emit('hovered', chunk, number);
      },
    },
  }
</script>

<style lang="scss" scoped>
  .alignments-picker {
    font-size: 10pt;
    opacity: 0;
    color: transparent;
    cursor: pointer;
    display: block;
    height: 20px;
    min-width: 1px;
  }
</style>
