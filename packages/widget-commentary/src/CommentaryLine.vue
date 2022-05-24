<template>
  <div class="commentary-container">
    <div class="commentary" v-html="line.data.commentary" />
    <div
      v-if="line.data.witnesses && line.data.witnesses.length > 0"
      class="tags"
    >
      <span
        v-for="(witness, idx) in line.data.witnesses"
        :key="idx"
        class="tag"
      >
        #{{ witness.label }}
      </span>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'WidgetCommentaryLine',
    props: ['line'],
  };
</script>
<style lang="scss" scoped>
  .commentary-container {
    margin-bottom: 0.375rem;
  }
  .tags {
    margin-bottom: 1em;
  }
  .tag {
    display: inline-block;
    margin-inline-end: 0.5em;
    font-size: 0.8em;
  }
</style>
