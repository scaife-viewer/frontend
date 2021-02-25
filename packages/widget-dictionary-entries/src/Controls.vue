<template>
  <div class="controls">
    <div class="control-rows" v-if="showConfig">
      <div class="control-row">
        <!-- NOTE: not stateful -->
        <div class="control-heading" title="sense expansion">
          Sense Expansion
        </div>
        <div class="control-group">
          <div
            title="collapse all"
            @click.prevent="onSelectSenseExpansion(SENSE_EXPANSION_COLLAPSED)"
          >
            Collapse All
          </div>
          <!-- NOTE: this is the default when loading an entry is passage -->
          <div
            title="passage"
            @click.prevent="onSelectSenseExpansion(SENSE_EXPANSION_PASSAGE)"
          >
            Expand to Passage
          </div>
          <div
            title="expand all"
            @click.prevent="onSelectSenseExpansion(SENSE_EXPANSION_EXPANDED)"
          >
            Expand All
          </div>
        </div>
      </div>
      <div class="control-row">
        <!-- NOTE: stateful, refs and quotes -->
        <div class="control-heading" title="citation display">
          Citation Display
        </div>
        <div class="control-group">
          <div
            title="hide"
            :class="{
              active: isActiveCitationDisplay(CITATION_DISPLAY_HIDDEN),
            }"
            @click.prevent="onSelectCitationDisplay(CITATION_DISPLAY_HIDDEN)"
          >
            Hide Citations
          </div>
          <div
            title="refs"
            :class="{
              active: isActiveCitationDisplay(CITATION_DISPLAY_REFS),
            }"
            @click.prevent="onSelectCitationDisplay(CITATION_DISPLAY_REFS)"
          >
            Show Refs
          </div>
          <div
            title="refs and quotes"
            :class="{
              active: isActiveCitationDisplay(CITATION_DISPLAY_REFS_QUOTES),
            }"
            @click.prevent="
              onSelectCitationDisplay(CITATION_DISPLAY_REFS_QUOTES)
            "
          >
            Show Refs / Quotes
          </div>
        </div>
      </div>
    </div>
    <div class="headword">
      <span>
        {{ headword }}
      </span>
      <span>
        <span class="control-toggle" @click.prevent="$emit('clear')"
          ><icon class="icon" name="times"
        /></span>
        <span
          :class="{ active: showConfig }"
          class="control-toggle"
          @click.prevent="toggle"
          ><icon class="icon" name="cog"
        /></span>
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
        showConfig: false,
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
        return this.$store.state[MODULE_NS].citationDisplay === value;
      },
      toggle() {
        this.showConfig = !this.showConfig;
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
  .control-toggle {
    font-weight: normal;
    color: var(--sv-widget-open-toggle-text-color, #ced4da);
    cursor: pointer;
    &:hover,
    &.active {
      color: var(
        --sv-widget-dictionary-entries-controls-active-text-color,
        #343a40
      );
      font-weight: unset;
    }
  }
  .icon {
    // margin-block-end: 2.0em;
  }
  .control-heading {
    color: initial;
    margin-right: 1em;
    text-transform: uppercase;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 14px;
    line-height: 24px;
    font-weight: 400;
  }
  .control-group {
    div {
      cursor: pointer;
      font-size: 14px;
      font-family: var(
        --sv-widget-dictionary-entries-controls-font-family,
        'Noto Serif'
      );
      padding-top: 5px;
      &:hover,
      &.active {
        color: var(
          --sv-widget-dictionary-entries-controls-active-text-color,
          #343a40
        );
      }
    }
  }
  .control-rows {
    margin-bottom: 1em;
  }
  .control-row {
    margin-top: 0.5em;
    color: var(--sv-widget-dictionary-entries-controls-text-color, #868e96);
  }
  .headword {
    display: flex;
    justify-content: space-between;
    color: var(--sv-widget-dictionary-entries-headword-text-color, #343a40);
    font-weight: 600;
  }
</style>
