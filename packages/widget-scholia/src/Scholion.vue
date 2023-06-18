<template>
  <div class="line">
    <span
      class="lemma"
      @click="onScholionClick(line)"
      :class="{ highlight: isScholionHiglighted }"
    >{{ line.lemma }}</span>
    <span class="comment"> {{ line.comment }}</span>
  </div>
</template>


<script>
import { MODULE_NS, SELECT_SCHOLION } from '@scaife-viewer/store';

export default {
  name: 'Scholion',
  props: {
    line: Object
  },
  computed: {
    isScholionHiglighted() {
      const highlightedScholion = this.$store.getters[`${MODULE_NS}/selectedScholion`];

      const scholionHighlightedByIndex = (highlightedScholion || {}).idx === this.line.idx;

      if (scholionHighlightedByIndex) {
        return true;
      }

      const highlightedTranscription = this.$store.getters[`${MODULE_NS}/highlightedTranscription`];

      return this.line.references.some(ref => ref.endsWith(highlightedTranscription));
    },
  },
  methods: {
    onScholionClick(scholion) {
      this.$store.dispatch(`${MODULE_NS}/${SELECT_SCHOLION}`, {
        scholion,
      });
    }
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
