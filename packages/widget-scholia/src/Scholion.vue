<template>
  <div class="line" :class="{ highlight: isScholionHiglighted }">
    <span class="lemma" @click="onScholionClick(line)"
      ><Icon class="badge" :class="kindClass" :name="'square'" />{{
        line.lemma || '*'
      }}</span
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

  import {
    SCHOLIA_KIND_MAIN,
    SCHOLIA_KIND_EXTERIOR,
    SCHOLIA_KIND_INTERLINEAR,
    SCHOLIA_KIND_INTERMARGINAL,
    SCHOLIA_KIND_INTERIOR,
    SCHOLIA_KIND_MISC,
    SCHOLIA_URN_MAIN,
    SCHOLIA_URN_EXTERIOR,
    SCHOLIA_URN_INTERLINEAR,
    SCHOLIA_URN_INTERMARGINAL,
    SCHOLIA_URN_INTERIOR,
  } from '@scaife-viewer/common';

  function isScholionHighlightedByIndex(scholion, idx) {
    return scholion.idx === idx;
  }

  export default {
    name: 'Scholion',
    props: {
      line: Object,
    },
    computed: {
      kindClass() {
        const { urn } = this.line;
        if (urn.startsWith(SCHOLIA_URN_MAIN)) {
          return SCHOLIA_KIND_MAIN;
        }
        if (urn.startsWith(SCHOLIA_URN_EXTERIOR)) {
          return SCHOLIA_KIND_EXTERIOR;
        }
        if (urn.startsWith(SCHOLIA_URN_INTERLINEAR)) {
          return SCHOLIA_KIND_INTERLINEAR;
        }
        if (urn.startsWith(SCHOLIA_URN_INTERMARGINAL)) {
          return SCHOLIA_KIND_INTERMARGINAL;
        }
        if (urn.startsWith(SCHOLIA_URN_INTERIOR)) {
          return SCHOLIA_KIND_INTERIOR;
        }
        return SCHOLIA_KIND_MISC;
      },
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
    &.highlight {
      background: var(--sv-widget-scholia-selected-background-color, #f8f9fa);
      margin-left: -10px;
      padding: 3px 7px;
      border-left: 3px solid
        var(--sv-widget-scholia-selected-border-color, #343a40);
    }

    .lemma {
      cursor: pointer;
      font-weight: 700;

      &:hover {
        text-decoration: underline;
      }
    }

    .badge {
      // FIXME: refactor these with ImageViewer
      &.scholia-kind-misc {
        color: rgba(127, 127, 127, 0.5);
      }
      &.scholia-kind-main {
        color: rgba(165, 127, 89, 0.5);
      }
      &.scholia-kind-exterior {
        color: rgba(89, 89, 165, 0.5);
      }
      &.scholia-kind-interlinear {
        color: rgba(18, 203, 196, 0.5);
      }
      &.scholia-kind-intermarginal {
        color: rgba(127, 165, 89, 0.5);
      }
      &.scholia-kind-interior {
        color: rgba(60, 99, 130, 0.5);
      }
    }
    margin-bottom: 10px;
  }
</style>
