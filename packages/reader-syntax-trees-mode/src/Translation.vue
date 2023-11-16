<template>
  <div
    class="text"
    :class="[`text-${textSize}`, `text-width-${textWidth}`, textDirection]"
    v-html="content"
  />
</template>

<script>
  import { MODULE_NS } from '@scaife-viewer/store';
  // TODO: Update from PassageLanguageIsRtlMixin
  const RTL_LANGUAGES = new Set(['far']);

  export default {
    props: ['content', 'lang'],
    computed: {
      textSize() {
        return this.$store.state[MODULE_NS].readerTextSize;
      },
      textWidth() {
        return this.$store.state[MODULE_NS].readerTextWidth;
      },
      isRtl() {
        return RTL_LANGUAGES.has(this.lang);
      },
      textDirection() {
        return this.isRtl ? 'rtl' : 'ltr';
      },
    },
  };
</script>

<style lang="scss" scoped>
  // TODO: Improve re-use with other styles

  .text.rtl {
    direction: rtl;
    font-family: var(
      --sv-reader-syntax-trees-mode-sentence-font-family-rtl,
      'Amiri',
      'Noto Serif'
    );

    &.text-xs {
      font-size: 16px;
      line-height: 1.5;
    }
    &.text-sm {
      font-size: 20px;
      line-height: 1.6;
    }
    &.text-md {
      font-size: 24px;
      line-height: 1.7;
    }
    &.text-lg {
      font-size: 28px;
      line-height: 1.8;
    }
    &.text-xl {
      font-size: 32px;
      line-height: 1.9;
    }
  }
  .text {
    font-family: var(
      --sv-reader-syntax-trees-mode-sentence-font-family,
      'Noto Serif'
    );
    line-height: 1.8;
    margin: 1em 0;
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
  .ref {
    font-size: 10pt;
    color: var(--sv-reader-syntax-trees-mode-ref-text-color, #69c);
    font-family: var(
      --sv-reader-syntax-trees-mode-ref-font-family,
      'Noto Sans'
    );
    margin-right: 1em;
  }
</style>
