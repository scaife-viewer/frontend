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
      class="dictionary-select"
      v-model="selectedDictionary"
      :options="dictionaryValues"
    />
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import { CustomSelect } from '@scaife-viewer/common';
  import { MODULE_NS } from '@scaife-viewer/store';

  export default {
    components: {
      CustomSelect,
    },
    data() {
      return {
        selectedDictionary: {
          title: 'All Dictionaries',
          value: null,
        },
      };
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
      sortedDictionaries() {
        if (!this.dictionaries) {
          return [];
        }
        const sortedDictionaries = [...this.dictionaries];
        return sortedDictionaries.sort((a, b) =>
          a.label.localeCompare(b.label),
        );
      },
      dictionaryValues() {
        const values = this.sortedDictionaries.map(dictionary => {
          return {
            title: dictionary.label,
            value: dictionary.urn,
          };
        });
        console.log(values);
        values.push({
          title: 'All Dictionaries',
          value: null,
        });
        return values.filter(
          value => value.value !== this.selectedDictionary.value,
        );
      },
    },
    apollo: {
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
