<template>
  <div class="alignments">
    <SentenceAlignment
      v-for="record in records"
      :key="record.id"
      :record="record"
      :textSize="textSize"
      :textWidth="textWidth"
    />
  </div>
</template>

<script>
  import SentenceAlignment from './SentenceAlignment.vue';

  export default {
    props: ['data', 'textSize', 'textWidth'],
    components: { SentenceAlignment },
    computed: {
      records() {
        return this.data.alignmentRecords;
      }
    }
  };
</script>

