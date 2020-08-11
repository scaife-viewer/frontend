<template>
  <span
    class="text-size-control"
    :class="[`text-${size}`, { selected }]"
    @click.prevent="$emit('input', size)"
    >Αα</span
  >
</template>

<script>
  export default {
    name: 'TextSize',
    props: ['value', 'size'],
    computed: {
      selected() {
        return this.value === this.size;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .text-size-control {
    cursor: pointer;
    font-family: var(--sv-widget-text-size-font-family, 'Noto Serif');
    color: var(--sv-widget-text-size-text-color, #adb5bd);
  }
  .text-size-control.selected {
    color: var(--sv-widget-text-size-selected-text-color, #343a40);
  }

  .text-xs {
    font-size: 12px;
  }
  .text-sm {
    font-size: 14px;
  }
  .text-md {
    font-size: 16px;
  }
  .text-lg {
    font-size: 20px;
  }
  .text-xl {
    font-size: 24px;
  }
</style>
