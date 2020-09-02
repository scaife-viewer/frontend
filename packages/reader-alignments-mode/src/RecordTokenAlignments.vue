<template>
  <div class="alignments">
    <RecordTokenAlignment
      v-for="record in records"
      :key="record.id"
      :record="record"
      :textSize="textSize"
      :textWidth="textWidth"
    />
  </div>
</template>

<script>
  import RecordTokenAlignment from './RecordTokenAlignment.vue';

  export default {
    props: ['data', 'textSize', 'textWidth'],
    components: { RecordTokenAlignment },
    computed: {
      records() {
        return this.data.alignmentRecords;
      }
    }
  };
</script>

