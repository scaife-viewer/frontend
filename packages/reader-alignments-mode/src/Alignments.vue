<template>
  <div class="alignments">
    <Alignment
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
  import Alignment from './Alignment.vue';

  export default {
    props: ['alignments', 'textSize', 'textWidth'],
    components: { Alignment },
  };
</script>

