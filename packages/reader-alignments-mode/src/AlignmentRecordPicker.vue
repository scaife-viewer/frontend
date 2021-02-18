<template>
  <span class="alignment-records-picker">
    <AlignmentRecord
      v-for="(record, index) in records"
      :key="record"
      :record="record"
      :number="index"
      @hovered="onHover"
    />
    <span class="placeholder" v-if="records.length === 0"></span>
  </span>
</template>

<script>
  import AlignmentRecord from './AlignmentRecord.vue';

  export default {
    props: ['records'],
    components: { AlignmentRecord },
    methods: {
      onHover(record, number) {
        this.$emit('hovered', record, number);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .alignment-records-picker {
    font-size: 1px;
    opacity: 0;
    color: transparent;
    cursor: pointer;
    display: block;
    margin-top: 2px;
    min-width: 1px;
  }
  .placeholder {
    display: inline-block;
    width: 1px;
    height: 8px;
    border-radius: 2px;
    margin-right: 4px;
  }
</style>
