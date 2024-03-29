<template>
  <div class="morphology">
    <LoaderBall v-if="loading" />
    <div v-else-if="morphBody">
      <div
        class="group"
        :class="{ selected: group.selected }"
        v-for="group in groups"
        :key="group.uri"
        @click="handleClick(group)"
      >
        <div class="head">
          <span class="hdwd">{{ group.hdwd }}</span>
          <span class="pofs-decl">{{ group.pofs }} {{ group.decl }}</span>
        </div>
        <div class="entries">
          <div
            :key="`entry-${index}`"
            class="entry"
            v-for="(entry, index) in group.infl"
          >
            <div class="form">
              <span class="stem">{{ entry.stem }}</span
              ><span v-if="entry.suff" class="suff">-{{ entry.suff }}</span>
            </div>
            <!-- {{ entry.pofs }} -->
            <!-- {{ entry.stemtype }} -->
            <div class="props">
              {{ entry.tense }}
              {{ entry.voice }}
              {{ entry.mood }}
              {{ entry.pers }}
              {{ entry.case }}
              {{ entry.num }}
              {{ entry.gend }}
              {{ entry.comp }}
              <span v-if="entry.dial" class="dial">({{ entry.dial }})</span>
            </div>
            <!-- {{ entry.derivtype }} -->
            <!-- {{ entry.morph }} -->
          </div>
        </div>
      </div>
    </div>
    <EmptyMessage v-else-if="selectedWord">No results found.</EmptyMessage>
    <p v-else-if="isScaifeViewerVersion1" class="instructions">
      In <span class="mode">HIGHLIGHT</span> text mode, select a word to get
      morphological analysis (Greek and Latin only).
    </p>
    <p v-else class="instructions">
      Select a word to get morphological analysis (Greek and Latin only).
    </p>
  </div>
</template>

<script>
  // import gql from 'graphql-tag';
  import { LoaderBall, EmptyMessage } from '@scaife-viewer/common';
  import {
    MODULE_NS,
    SET_SELECTED_LEMMAS,
    // CLEAR_TOKEN
  } from '@scaife-viewer/store';

  // FIXME: Rework API endpoint to use GraphQL and query for supported languages
  const MORPHOLOGY_API_ENDPOINT =
    process.env.VUE_APP_MORPHOLOGY_API_ENDPOINT ||
    'https://sv-morphology-api.herokuapp.com/morphology/api/v1';
  export default {
    scaifeConfig: {
      displayName: 'Morphology',
    },
    data() {
      return {
        loading: false,
        morphBody: null,
      };
    },
    watch: {
      selectedToken: {
        handler: 'fetchData',
        immediate: true,
      },
    },
    components: { EmptyMessage, LoaderBall },
    computed: {
      enabled() {
        // FIXME: Determine if backend supports language
        return true;
      },
      lang() {
        const { metadata } = this.$store.state.scaife;
        return metadata ? metadata.lang : '';
      },
      // FIXME: Review for SV 1 compatiblity
      selectedToken() {
        return this.$store.state[MODULE_NS].selectedToken;
      },
      selectedLemmas() {
        return this.$store.getters[`${MODULE_NS}/selectedLemmas`];
      },
      selectedWord() {
        if (this.selectedToken) {
          return {
            // FIXME: wordValue vs value here?
            w: this.selectedToken.value.replace(/\p{P}/gu, ''),
          };
        }
        return null;
      },
      isScaifeViewerVersion1() {
        return this.$scaife.config.sv1;
      },
      groups() {
        return this.morphBody.map(group => {
          const isSelected = this.selected(group.hdwd);
          return {
            selected: isSelected,
            ...group,
          };
        });
      },
    },
    methods: {
      fetchData() {
        const word = this.selectedWord;
        if (!word) {
          this.reset();
        }
        const { lang } = this;
        if (word) {
          this.loading = true;
          const url = `${MORPHOLOGY_API_ENDPOINT}/?word=${word.w}&lang=${lang}`;
          const headers = new Headers({
            Accept: 'application/json',
          });
          fetch(url, { mode: 'cors', method: 'GET', headers })
            .then(resp => resp.json())
            .then(data => {
              if (data.Body && data.Body.length > 0) {
                this.morphBody = data.Body;
                const lemmas = [];
                if (this.selectedToken.lemma) {
                  lemmas.push(this.selectedToken.lemma);
                } else {
                  this.morphBody.forEach(({ hdwd }) => {
                    lemmas.push(hdwd);
                  });
                }
                this.$store.commit(`${MODULE_NS}/${SET_SELECTED_LEMMAS}`, {
                  lemmas: lemmas.slice(0, 1),
                });
              } else {
                this.reset();
              }
              this.loading = false;
            })
            .catch(error => {
              this.reset();
              console.log(error.message);
            });
        }
      },
      reset() {
        this.morphBody = null;
        this.$store.commit(`${MODULE_NS}/${SET_SELECTED_LEMMAS}`, {
          lemmas: null,
        });
      },
      handleClick(group) {
        const lemmas = [group.hdwd];
        this.$store.commit(`${MODULE_NS}/${SET_SELECTED_LEMMAS}`, {
          lemmas,
        });
      },
      selected(headword) {
        return this.selectedLemmas
          ? this.selectedLemmas.filter(lemma => lemma === headword).length > 0
          : false;
      },
    },
  };
</script>

<style lang="scss" scoped>
  div.morphology {
    font-size: 12px;
    font-family: var(--sv-widget-morphology-text-font-family, 'Noto Serif');
    color: var(--sv-widget-morphology-text-color, #495057);
    width: 100%;
  }
  p.no-results {
    margin: 0 0 0 22px;
    color: var(--sv-widget-morphology-legend-color, #868e96);
  }
  p.instructions {
    font-family: var(--sv-widget-morphology-legend-font-family, 'Noto Sans');
    font-size: 12px;
    color: var(--sv-widget-morphology-legend-color, #868e96);
    margin: 0 0 0 22px;
    span.mode {
      color: #000;
      font-family: var(--sv-widget-morphology-text-font-family, 'Noto Serif');
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
  }
  .group {
    margin-top: 1em;
    &:first-of-type {
      margin-top: 0;
    }
    .head {
      font-size: 16px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .hdwd {
        font-weight: bold;
      }
      .pofs-decl {
        margin-left: 1em;
        font-size: 14px;
        font-family: var(
          --sv-widget-morphology-legend-font-family,
          'Noto Sans'
        );

        color: var(--sv-widget-morphology-legend-color, #868e96);
      }
    }
    .entries {
      margin-left: 1em;
      .entry {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        .form {
          font-weight: bold;
        }
        .props {
          margin-left: 1em;
          font-family: var(
            --sv-widget-morphology-legend-font-family,
            'Noto Sans'
          );
          color: var(--sv-widget-morphology-legend-color, #868e96);
        }
        .dial {
          font-style: italic;
          font-family: var(
            --sv-widget-morphology-legend-font-family,
            'Noto Sans'
          );
          color: var(--sv-widget-morphology-legend-color, #868e96);
        }
      }
    }
    &.selected {
      background: var(
        --sv-widget-morphology-selected-background-color,
        #f8f9fa
      );
      margin-left: -10px;
      padding: 3px 7px;
      border-left: 3px solid
        var(--sv-widget-morphology-selected-border-color, #343a40);
    }
  }
</style>
