<template>
  <div class="reader">
    <div
      class="reader-container text"
      :class="[`text-${textSize}`, `text-width-${textWidth}`]"
    >
      <ReaderLine v-for="line in lines" :key="line.id" :line="line" />

      <Attribution v-if="showMetricalCredit" class="metrical-attribution">
        Metrical annotation &copy; 2016
        <a href="https://hypotactic.com/" target="_blank">David Chamberlain</a>
        under
        <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank"
          >CC BY 4.0 License</a
        >
      </Attribution>
      <EmptyMessage class="reader-empty-annotations" v-if="showMetricalEmpty" />
    </div>
  </div>
</template>

<script>
  import { Attribution, EmptyMessage } from '@scaife-viewer/common';
  import { MODULE_NS } from '@scaife-viewer/store';
  import ReaderLine from './ReaderLine.vue';

  export default {
    components: { Attribution, EmptyMessage, ReaderLine },
    props: ['lines'],
    computed: {
      textSize() {
        return this.$store.state[MODULE_NS].readerTextSize;
      },
      textWidth() {
        return this.$store.state[MODULE_NS].readerTextWidth;
      },
      metricalMode() {
        return this.$store.getters[`${MODULE_NS}/metricalMode`];
      },
      showMetricalCredit() {
        if (!this.metricalModel) {
          return false;
        }
        const hasContent =
          this.lines.filter(line => {
            const { metricalAnnotations } = line;
            return metricalAnnotations[0] && metricalAnnotations[0].htmlContent;
          }).length > 0;
        return hasContent;
      },
      metricalLines() {
        if (!this.metricalMode) {
          return [];
        }
        return this.lines.filter(line => {
          const { metricalAnnotations } = line;
          const annotation = metricalAnnotations[0];
          const htmlContent = annotation && annotation.htmlContent;
          return htmlContent !== undefined;
        });
      },
      showMetricalEmpty() {
        if (!this.metricalMode) {
          return false;
        }
        return this.metricalLines.length === 0;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .reader {
    display: flex;
    justify-content: center;
  }
  .text {
    font-family: var(--widget-reader-text-font-family, 'Noto Serif');
    margin: 1em 0;

    &.text-xs {
      line-height: 1.5;
    }
    &.text-sm {
      line-height: 1.6;
    }
    &.text-md {
      line-height: 1.7;
    }
    &.text-lg {
      line-height: 1.8;
    }
    &.text-xl {
      line-height: 1.9;
    }
  }

  .widget-sidebar .text {
    font-size: 14px;
    line-height: 1.6;
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

  .metrical-attribution {
    margin-top: 1rem;
    text-align: center;
  }

  // TODO: media queries for defaults?
  .text-width-narrow {
    max-width: 20em;
  }

  .text-width-normal {
    max-width: 30em;
  }

  .text-width-wide {
    max-width: 40em;
  }

  .text-width-full {
    max-width: 100%;
  }
</style>
