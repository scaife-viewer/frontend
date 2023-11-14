<template>
  <div class="legend">
    <a href class="legend-toggle" @click.prevent="shown = !shown">{{
      !shown ? `Show Legend` : `Hide Legend`
    }}</a>
    <div v-if="shown">
      <div
        class="legend-item"
        v-for="([kindName, kindLabel], kindIdx) in $options.constants
          .SCHOLIA_KIND_CHOICES"
        :key="kindIdx"
      >
        <Icon :class="kindName" :name="'square'" />{{ kindLabel }}
      </div>
    </div>
  </div>
</template>

<script>
  import { SCHOLIA_KIND_CHOICES } from '@scaife-viewer/common';

  export default {
    name: 'Legend',
    constants: {
      SCHOLIA_KIND_CHOICES,
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
  .scholia-kind-misc {
    color: var(
      --sv-widget-reader-image-mode-scholia-kind-misc-color,
      rgba(127, 127, 127, 0.5)
    );
  }
  .scholia-kind-main {
    color: var(
      --sv-widget-reader-image-mode-scholia-kind-main-color,
      rgba(165, 127, 89, 0.5)
    );
  }
  .scholia-kind-exterior {
    color: var(
      --sv-widget-reader-image-mode-scholia-kind-exterior-color,
      rgba(89, 89, 165, 0.5)
    );
  }
  .scholia-kind-interlinear {
    color: var(
      --sv-widget-reader-image-mode-scholia-kind-interlinear-color,
      rgba(18, 203, 196, 0.5)
    );
  }
  .scholia-kind-intermarginal {
    color: var(
      --sv-widget-reader-image-mode-scholia-kind-intermarginal-color,
      rgba(127, 165, 89, 0.5)
    );
  }
  .scholia-kind-interior {
    color: var(
      --sv-widget-reader-image-mode-scholia-kind-interior-color,
      rgba(60, 99, 130, 0.5)
    );
  }
</style>
