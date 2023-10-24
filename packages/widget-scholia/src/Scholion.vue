<template>
  <div class="line">
    <span
      class="lemma"
      @click="onScholionClick(line)"
      :class="{ highlight: isScholionHiglighted }"
      >{{ line.lemma || '*' }}</span
    >
    <span class="comment"> {{ line.comment }}</span>
  </div>
</template>

<script>
  import {
    MODULE_NS,
    SELECT_SCHOLION,
    SELECT_LINE,
  } from '@scaife-viewer/store';

  function isScholionHighlightedByIndex(scholion, idx) {
    return scholion.idx === idx;
  }

  export default {
    name: 'Scholion',
    props: {
      line: Object,
    },
    computed: {
      isScholionHiglighted() {
        const highlightedScholion = this.$store.getters[
          `${MODULE_NS}/selectedScholion`
        ];

        // NB: After the highlightedScholion is set for the first time,
        // it becomes an Observer --- that's why we check for null/undefined
        // of highlightedScholion.idx as well.
        if (highlightedScholion !== null && highlightedScholion.idx != null) {
          return isScholionHighlightedByIndex(
            highlightedScholion,
            this.line.idx,
          );
        }

        const highlightedTranscription = this.$store.getters[
          `${MODULE_NS}/highlightedTranscription`
        ];

        return this.line.references.some(ref =>
          ref.endsWith(highlightedTranscription),
        );
      },
    },
    methods: {
      async onScholionClick(scholion) {
        // reset token in case one was selected in the ReaderWidget
        await this.$store.dispatch(`${MODULE_NS}/${SELECT_LINE}`, {
          ref: null,
        });
        this.$store.dispatch(`${MODULE_NS}/${SELECT_SCHOLION}`, {
          scholion,
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .line {
    font-family: var(--sv-widget-scholia-line-font-family, 'Noto Serif');
    font-size: 14px;

    .highlight {
      background: var(
        --sv-widget-reader-token-selected-entity-shadow-color,
        #9f9
      );
    }
    .lemma {
      cursor: pointer;
      font-weight: 700;

      &:hover {
        text-decoration: underline;
      }
    }

    margin-bottom: 10px;
  }
</style>
