<template>
  <div class="line" :class="{ highlight: isScholionHiglighted }">
    <span class="lemma-container" @click="onScholionClick(line)"
      ><span :class="{ hover }" class="lemma-legend" @mouseleave="hover = false"
        ><span class="badge-container" @mouseover="hover = true"
          ><Icon :class="kindClass" class="badge" :name="'square'"/></span
        ><span v-if="hover" class="inline-legend-label">{{
          kindLabel
        }}</span></span
      ><span class="lemma-content">{{ line.lemma || '*' }}</span></span
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
    SCHOLIA_KIND_CHOICES,
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
    data() {
      return {
        hover: false,
      };
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
      kindLabel() {
        return SCHOLIA_KIND_CHOICES.get(this.kindClass);
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
    .lemma-content,
    .comment {
      font-family: var(--sv-widget-scholia-line-font-family, 'Noto Serif');
      font-size: 14px;
    }
    &.highlight {
      background: var(--sv-widget-scholia-selected-background-color, #f8f9fa);
      margin-left: -10px;
      padding: 3px 7px;
      border-left: 3px solid
        var(--sv-widget-scholia-selected-border-color, #343a40);
    }
    .lemma-container {
      cursor: pointer;
      .inline-legend-label {
        margin-inline-start: 0.25rem;
        margin-inline-end: 0.5rem;
        color: var(--sv-widget-scholia-inline-legend-label-text-color, #868e96);
      }
      .lemma-content {
        font-weight: 700;
      }
      &:hover > .lemma-content {
        text-decoration: underline;
      }
    }

    .badge {
      &.scholia-kind-misc {
        color: var(
          --sv-widget-reader-image-mode-scholia-kind-misc-color,
          rgba(127, 127, 127, 0.5)
        );
      }
      &.scholia-kind-main {
        color: var(
          --sv-widget-reader-image-mode-scholia-kind-main-color,
          rgba(165, 127, 89, 0.5)
        );
      }
      &.scholia-kind-exterior {
        color: var(
          --sv-widget-reader-image-mode-scholia-kind-exterior-color,
          rgba(89, 89, 165, 0.5)
        );
      }
      &.scholia-kind-interlinear {
        color: var(
          --sv-widget-reader-image-mode-scholia-kind-interlinear-color,
          rgba(18, 203, 196, 0.5)
        );
      }
      &.scholia-kind-intermarginal {
        color: var(
          --sv-widget-reader-image-mode-scholia-kind-intermarginal-color,
          rgba(127, 165, 89, 0.5)
        );
      }
      &.scholia-kind-interior {
        color: var(
          --sv-widget-reader-image-mode-scholia-kind-interior-color,
          rgba(60, 99, 130, 0.5)
        );
      }
    }
    margin-bottom: 10px;
  }
</style>
