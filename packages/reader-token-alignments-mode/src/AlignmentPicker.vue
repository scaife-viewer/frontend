<template>
  <span class="alignments-picker">
    <Chunk
      v-for="(chunk, index) in chunks" :key="chunk"
      :chunk="chunk"
      :number="index"
      @hovered="onHover"
    />
    <span class="placeholder-chunk" v-if="chunks.length === 0"></span>
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
  .placeholder-chunk {
    display: inline-block;
    width: 20px;
    height: 8px;
    border-radius: 2px;
    margin-right: 4px;
  }
</style>
