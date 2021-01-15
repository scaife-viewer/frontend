<template>
  <div class="dictionary-entry">
    {{ entry.headword }}
  </div>
</template>

<script>
  export default {
    props: {
      entry: {
        type: Object,
        required: true,
      },
    },
  };
</script>
