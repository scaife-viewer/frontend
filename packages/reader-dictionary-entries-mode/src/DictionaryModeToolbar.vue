<template>
  <div class="dictionary-mode-toolbar">
    <span
      :class="{ active: showCited }"
      class="cited"
      @click.prevent="showCited = !showCited"
    >
      Cited
    </span>
    <span
      :class="{ active: showAvailable }"
      class="available"
      @click.prevent="showAvailable = !showAvailable"
    >
      Available
    </span>
    <span
      :class="{ active: showMissing }"
      class="missing"
      @click.prevent="showMissing = !showMissing"
    >
      Missing
    </span>
  </div>
</template>

<script>
  import { MODULE_NS } from '@scaife-viewer/store';

  export default {
    computed: {
      showCited: {
        get() {
          return this.$store.state[MODULE_NS].showCitedLemmas;
        },
        set() {
          this.$store.state[MODULE_NS].showCitedLemmas = !this.$store.state[
            MODULE_NS
          ].showCitedLemmas;
        },
      },
      showAvailable: {
        get() {
          return this.$store.state[MODULE_NS].showAvailableLemmas;
        },
        set() {
          this.$store.state[MODULE_NS].showAvailableLemmas = !this.$store.state[
            MODULE_NS
          ].showAvailableLemmas;
        },
      },
      showMissing: {
        get() {
          return this.$store.state[MODULE_NS].showMissingLemmas;
        },
        set() {
          this.$store.state[MODULE_NS].showMissingLemmas = !this.$store.state[
            MODULE_NS
          ].showMissingLemmas;
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  .dictionary-mode-toolbar {
    display: flex;
    padding-bottom: 0.75rem;
    span {
      margin: 0 0.5rem;
      padding: 0.25rem;
      font-size: 14px;
      cursor: pointer;
      text-align: center;
      color: var(--sv-syntax-trees-mode-toolbar-text-color, #adb5bd);
    }
    span.active {
      color: var(--sv-syntax-trees-mode-toolbar-active-text-color, #343a40);
      &.cited {
        background-color: var(
          --sv-widget-reader-dictionary-cited-background-color,
          #92fade
        );
      }
      &.available {
        background-color: var(
          --sv-widget-reader-dictionary-resolved-background-color,
          #9ad5f5
        );
      }
      &.missing {
        background-color: var(
          --sv-widget-reader-dictionary-excluded-background-color,
          #facba6
        );
      }
    }
  }
</style>
