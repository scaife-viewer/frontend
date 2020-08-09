<template>
  <span
    :class="['text-width-control', { active }]"
    @click.prevent="$emit('input', width)"
    >{{ text }}</span
  >
</template>

<script>
  export default {
    name: 'TextWidth',
    props: ['value', 'width'],
    computed: {
      active() {
        return this.value === this.width;
      },
      text() {
        return this.width.charAt(0).toUpperCase() + this.width.slice(1);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .text-width-control {
    cursor: pointer;
    font-family: var(--sv-widget-text-width-font-family, 'Noto Serif');
    color: var(--sv-widget-text-width-text-color, #adb5bd);
    font-size: 14px;
    padding-right: 5px;
  }

  .text-width-control.active {
    color: var(--sv-widget-text-width-selected-text-color, #343a40);
  }
</style>
