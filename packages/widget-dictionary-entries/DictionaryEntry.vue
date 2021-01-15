<template>
  <div class="dictionary-entry">
    {{ entry.label }}
  </div>
</template>

<script>
  export default {
    props: {
      entry: {
        type: Object,
        required: true,
      },
    }
  };
</script>
