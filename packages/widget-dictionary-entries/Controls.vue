<template>
  <div class="controls">
    <!-- NOTE: not stateful -->
    <span class="control-heading" title="sense expansion">senses</span>
    <span class="control-group">
      <!-- NOTE: this is the default when loading an entry is passage -->
      <span title="passage">passage</span>
      <span title="expand all">expand</span>
      <span title="collapse all">collapse</span>
    </span>
    <br />
    <!-- NOTE: stateful, refs and quotes -->
    <span class="control-heading" title="citation display">citations</span>
    <span class="control-group">
      <span title="refs">refs</span>
      <span title="refs and quotes" class="active">refs / quotes</span>
      <span title="hide">hide</span>
    </span>
  </div>
</template>
<style lang="scss" scoped>
  .controls {
    font-size: 10px;
    color: var(--sv-widget-dictionary-entries-controls-font-color, #adb5bd);
    width: calc(100% - 4rem);
    margin: 0 2rem;
    margin-bottom: 2rem;
  }
  .control-heading {
    font-size: 14px;
    font-weight: 600;
    margin-right: 30px;
  }
  .control-group {
    span {
      cursor: pointer;
      font-family: var(
        --sv-widget-dictionary-entries-controls-font-family,
        'Noto Serif'
      );
      font-size: 14px;
      margin-right: 15px;
      &.active {
        font-weight: 600;
      }
    }
  }
</style>
