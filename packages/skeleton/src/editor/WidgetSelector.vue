<template>
  <div class="add-widgets">
    <div
      v-for="(option, i) in options"
      :key="i"
      class="widget-option"
      :class="{ selected: selected(option) }"
      @click.prevent="$emit('select', option.component)"
    >
      <span><Icon :name="iconName(option)"/></span>
      <span>{{ option.text }}</span>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['options', 'mainWidget'],
    methods: {
      selected(option) {
        return this.mainWidget && this.mainWidget === option.component;
      },
      iconName(option) {
        if (this.mainWidget) {
          return this.mainWidget === option.component
            ? 'check-square'
            : 'square';
        }
        return 'plus-square';
      },
    },
  };
</script>

<style lang="scss">
  .widget-option {
    display: flex;
    justify-content: flex-start;
    cursor: pointer;
    padding: 0.75rem 1.25rem;
    margin: 0.5rem 0.375rem;
    border: 1px solid var(--sv-widget-option-border-color, #f8f9fa);
    background: var(--sv-widget-option-background-color, #e9ecef);
    color: var(--sv-widget-option-text-color, #495057);

    span:first-of-type {
      margin-right: 8px;
    }
    &:hover,
    &.selected {
      background: var(--sv-widget-option-selected-background-color, #dee2e6);
      color: var(--sv-widget-option-selected-text-color, #000);
      span svg {
        color: var(--sv-widget-option-selected-svg-color, #0a0);
      }
    }

    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
  }
</style>
