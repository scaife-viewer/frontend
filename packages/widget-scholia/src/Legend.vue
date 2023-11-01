<template>
  <div class="legend">
    <a href class="legend-toggle" @click.prevent="shown = !shown">{{
      !shown ? `Show Legend` : `Hide Legend`
    }}</a>
    <div v-if="shown">
      <div class="legend-item">
        <Icon
          :class="$options.constants.SCHOLIA_KIND_MISC"
          :name="'square'"
        />Misc
      </div>
      <div class="legend-item">
        <Icon
          :class="$options.constants.SCHOLIA_KIND_MAIN"
          :name="'square'"
        />Main
      </div>
      <div class="legend-item">
        <Icon
          :class="$options.constants.SCHOLIA_KIND_EXTERIOR"
          :name="'square'"
        />Exterior
      </div>
      <div class="legend-item">
        <Icon
          :class="$options.constants.SCHOLIA_KIND_INTERLINEAR"
          :name="'square'"
        />Interlinear
      </div>
      <div class="legend-item">
        <Icon
          class="badge scholia-kind-intermarginal"
          :class="$options.constants.SCHOLIA_KIND_INTERMARGINAL"
          :name="'square'"
        />Intermarginal
      </div>
      <div class="legend-item">
        <Icon
          class="badge scholia-kind-interior"
          :class="$options.constants.SCHOLIA_KIND_INTERIOR"
          :name="'square'"
        />Interior
      </div>
    </div>
  </div>
</template>

<script>
  import {
    SCHOLIA_KIND_MAIN,
    SCHOLIA_KIND_EXTERIOR,
    SCHOLIA_KIND_INTERLINEAR,
    SCHOLIA_KIND_INTERMARGINAL,
    SCHOLIA_KIND_INTERIOR,
    SCHOLIA_KIND_MISC,
  } from '@scaife-viewer/common';

  export default {
    name: 'Legend',
    constants: {
      SCHOLIA_KIND_MAIN,
      SCHOLIA_KIND_EXTERIOR,
      SCHOLIA_KIND_INTERLINEAR,
      SCHOLIA_KIND_INTERMARGINAL,
      SCHOLIA_KIND_INTERIOR,
      SCHOLIA_KIND_MISC,
    },
    data() {
      return {
        shown: false,
      };
    },
  };
</script>

<style lang="scss" scoped>
  .legend {
    margin-top: 1em;
    margin-bottom: 1em;
  }
  .legend-toggle {
    font-size: var(--sv-widget-scholia-legend-toggle-font-size, 14px);
  }
  .legend-item {
    margin: 0.5em -0.5em -0.5em 0;
  }
  // FIXME: refactor these with ImageViewer
  .scholia-kind-misc {
    color: rgba(127, 127, 127, 0.5);
  }
  .scholia-kind-main {
    color: rgba(165, 127, 89, 0.5);
  }
  .scholia-kind-exterior {
    color: rgba(89, 89, 165, 0.5);
  }
  .scholia-kind-interlinear {
    color: rgba(18, 203, 196, 0.5);
  }
  .scholia-kind-intermarginal {
    color: rgba(127, 165, 89, 0.5);
  }
  .scholia-kind-interior {
    color: rgba(60, 99, 130, 0.5);
  }
</style>
