<template>
  <div class="dictionary-mode-toolbar">
    <div>
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
    <CustomSelect
      v-if="dictionaryOptions.length > 1"
      class="dictionary-select"
      v-model="selectedDictionaryOption"
      :options="dictionaryOptions"
    />
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import { CustomSelect } from '@scaife-viewer/common';
  import {
    MODULE_NS,
    SET_SELECTED_DICTIONARY_OPTION,
  } from '@scaife-viewer/store';

  export default {
    components: {
      CustomSelect,
    },
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
      selectedDictionaryOption: {
        get() {
          return this.$store.state[MODULE_NS].selectedDictionaryOption;
        },
        set(value) {
          this.$store.dispatch(
            `${MODULE_NS}/${SET_SELECTED_DICTIONARY_OPTION}`,
            {
              value,
            },
          );
        },
      },
      selectedDictionaryUrn() {
        return this.$store.getters[`${MODULE_NS}/selectedDictionaryUrn`];
      },
      sortedDictionaries() {
        if (!this.dictionaries) {
          return [];
        }
        const sortedDictionaries = [...this.dictionaries];
        return sortedDictionaries.sort((a, b) =>
          a.label.localeCompare(b.label),
        );
      },
      dictionaryOptions() {
        const defaultOption = {
          title: 'All Dictionaries',
          value: null,
        };
        const options = [];
        if (this.sortedDictionaries) {
          const sortedOptions = this.sortedDictionaries.map(dictionary => {
            return {
              title: dictionary.label,
              value: dictionary.urn,
            };
          });
          options.push(...sortedOptions);
        }
        options.push(defaultOption);
        // Exclude the selected option from possible options
        return options.filter(
          option => option.value !== this.selectedDictionaryOption.value,
        );
      },
    },
    apollo: {
      // TODO: Make dictionaries context aware
      // e.g. work, language, etc
      dictionaries: {
        query: gql`
          query Dictionaries {
            dictionaries {
              edges {
                node {
                  label
                  urn
                }
              }
            }
          }
        `,
        update(data) {
          return data.dictionaries.edges.map(e => e.node);
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  .dictionary-mode-toolbar {
    display: flex;
    justify-content: space-evenly;
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
  .dictionary-select {
    margin-top: -10px;
    min-width: 33%;
  }
</style>
