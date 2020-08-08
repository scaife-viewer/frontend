<template>
  <div class="widget-editor">
    <WidgetSelector
      :main-widget="mainWidget"
      :options="options"
      @select="(widget) => $emit('change-widget', widget)"
    />
  </div>
</template>

<script>
  import WidgetSelector from './WidgetSelector.vue';

  export default {
    props: ['mainWidget', 'options'],
    components: { WidgetSelector },
  };
</script>

<style lang="scss">
  .widget-editor {
    z-index: 2000; // has to be more than the widget sticky-block
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    border-top: 1px solid var(--sv-widget-editor-border-top-color, #dee2e6);
    background: var(--sv-widget-editor-background-color, #f8f9fa);
    display: block;
    button {
      margin: 15px 0;
      background: var(--sv-widget-editor-button-background-color, #e9ecef);
      color: var(--sv-widget-editor-button-text-color, #495057);
      padding: 0.5rem 2rem;
      border: none;
      font-size: 14px;
      &:hover {
        background: var(--sv-widget-editor-hover-button-background-color, #dee2e6);
        color: var(--sv-widget-editor-hover-button-text-color, #dee2e6);
      }
    }

    &.main-widget-editor {
      border-top: none;
      position: relative;
      margin-top: 100px;
      width: 80%;
      max-width: 900px;
      align-self: center;
    }
  }
</style>
