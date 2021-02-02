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
        <a
          title="passage"
          @click.prevent="onSelectSenseExpansion(SENSE_EXPANSION_PASSAGE)"
          >passage</a
        >
        <a
          title="expand all"
          @click.prevent="onSelectSenseExpansion(SENSE_EXPANSION_EXPANDED)"
          >expand</a
        >
        <a
          title="collapse all"
          @click.prevent="onSelectSenseExpansion(SENSE_EXPANSION_COLLAPSED)"
          >collapse</a
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
  }
  .control-heading {
    font-size: 14px;
    font-weight: 600;
    margin-right: 1em;
  }
  .control-group {
    a {
      font-size: 14px;
      padding-right: 5px;
      cursor: pointer;
    }
    span {
      cursor: pointer;
      font-family: var(--sv-widget-text-width-font-family, 'Noto Serif');
      color: var(--sv-widget-text-width-text-color, #adb5bd);
      font-size: 14px;
      padding-right: 5px;
    }
    span.active {
      color: var(--sv-widget-text-width-selected-text-color, #343a40);
    }
  }
  .control-row {
    margin-top: 0.25em;
  }
  .headword {
    display: flex;
    justify-content: space-between;
    font-size: 1.25em;
    color: var(--sv-widget-dictionary-entries-headword-text-color, #343a40);
    font-weight: 600;
    .clear-entry {
      margin-top: calc(1.25em / 2 - (14px / 2));
      font-size: 14px;
      cursor: pointer;
    }
  }
</style>
