<template>
  <div class="controls">
    <div class="headword">
      <span>
        {{ headword }}
      </span>
      <span class="clear-entry" @click.prevent="$emit('clear')">x</span>
    </div>
    <div class="control-row">
      <!-- NOTE: not stateful -->
      <span class="control-heading" title="sense expansion">senses:</span>
      <span class="control-group">
        <!-- NOTE: this is the default when loading an entry is passage -->
        <span
          title="passage"
          @click.prevent="onSelectSenseExpansion(SENSE_EXPANSION_PASSAGE)"
          >passage</span
        >
        <span
          title="expand all"
          @click.prevent="onSelectSenseExpansion(SENSE_EXPANSION_EXPANDED)"
          >expand</span
        >
        <span
          title="collapse all"
          @click.prevent="onSelectSenseExpansion(SENSE_EXPANSION_COLLAPSED)"
          >collapse</span
        >
      </span>
    </div>
    <div class="control-row">
      <!-- NOTE: stateful, refs and quotes -->
      <span class="control-heading" title="citation display">citations:</span>
      <span class="control-group">
        <span
          title="refs"
          :class="{
            active: isActiveCitationDisplay(CITATION_DISPLAY_REFS),
          }"
          @click.prevent="onSelectCitationDisplay(CITATION_DISPLAY_REFS)"
          >refs</span
        >
        <span
          title="refs and quotes"
          :class="{
            active: isActiveCitationDisplay(CITATION_DISPLAY_REFS_QUOTES),
          }"
          @click.prevent="onSelectCitationDisplay(CITATION_DISPLAY_REFS_QUOTES)"
          >refs / quo.</span
        >
        <span
          title="hide"
          :class="{ active: isActiveCitationDisplay(CITATION_DISPLAY_HIDDEN) }"
          @click.prevent="onSelectCitationDisplay(CITATION_DISPLAY_HIDDEN)"
          >hide</span
        >
      </span>
    </div>
  </div>
</template>
<script>
  import {
    MODULE_NS,
    SET_SENSE_EXPANSION,
    SET_CITATION_DISPLAY,
    CITATION_DISPLAY_REFS,
    CITATION_DISPLAY_REFS_QUOTES,
    CITATION_DISPLAY_HIDDEN,
    SENSE_EXPANSION_PASSAGE,
    SENSE_EXPANSION_EXPANDED,
    SENSE_EXPANSION_COLLAPSED,
  } from '@scaife-viewer/store';
  export default {
    props: ['headword'],
    data() {
      return {
        // TODO: best pratices?
        CITATION_DISPLAY_REFS,
        CITATION_DISPLAY_REFS_QUOTES,
        CITATION_DISPLAY_HIDDEN,
        SENSE_EXPANSION_PASSAGE,
        SENSE_EXPANSION_EXPANDED,
        SENSE_EXPANSION_COLLAPSED,
      };
    },
    methods: {
      onSelectSenseExpansion(value) {
        this.$store.dispatch(`${MODULE_NS}/${SET_SENSE_EXPANSION}`, {
          value,
        });
      },
      onSelectCitationDisplay(value) {
        this.$store.dispatch(`${MODULE_NS}/${SET_CITATION_DISPLAY}`, {
          value,
        });
      },
      isActiveCitationDisplay(value) {
        return this.$store.state[MODULE_NS].citationDisplay == value;
      },
    },
  };
</script>
<style lang="scss" scoped>
  .controls {
    width: calc(100% - 4rem);
    margin: 0 2rem;
    margin-block-end: 0.5em;
    color: var(--sv-widget-dictionary-entries-controls-text-color, #868e96);
    font-family: var(
      --sv-widget-dictionary-entries-controls-font-family,
      'Noto Serif'
    );
  }
  .control-heading {
    font-size: 14px;
    margin-right: 1em;
  }
  .control-group {
    span {
      cursor: pointer;
      font-size: 14px;
      padding-right: 5px;
      &:hover,
      &.active {
        color: var(
          --sv-widget-dictionary-entries-controls-active-text-color,
          #343a40
        );
      }
    }
  }
  .control-row {
    margin-top: 0.25em;
  }
  .headword {
    display: flex;
    justify-content: space-between;
    color: var(--sv-widget-dictionary-entries-headword-text-color, #343a40);
    font-weight: 600;
    .clear-entry {
      cursor: pointer;
    }
  }
</style>
