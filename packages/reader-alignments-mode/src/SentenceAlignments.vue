<template>
  <div class="alignments">
    <SentenceAlignment
      v-for="(alignment, index) in alignments"
      :key="index"
      :left="alignment[0]"
      :right="alignment[1]"
      :textSize="textSize"
      :textWidth="textWidth"
    />
  </div>
</template>

<script>
  import SentenceAlignment from './SentenceAlignment.vue';

  export default {
    props: ['alignments', 'textSize', 'textWidth'],
    components: { SentenceAlignment },
  };
</script>

