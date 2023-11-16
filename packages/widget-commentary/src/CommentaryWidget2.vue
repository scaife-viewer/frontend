<template>
  <div class="commentary">
    <!-- TODO: Select a commentary set -->
    <!-- TODO: Show attributions -->
    <div :key="urn.absolute" class="commentary-container">
      <div v-if="showToolbar" class="commentary-container-controls">
        <!-- TODO: Put these behind a cog and revisit labels -->
        <!-- Sync mode scroll to token could change the icon color -->
        <span @click="toggleHighlight()">
          <div class="mode">
            <a :class="[{ active: !showCommentary }]"> hide </a>
            <a :class="[{ active: showCommentary }]"> show </a>
          </div>
          <div class="help">
            <span v-if="!showCommentary">
              commentary annotations are hidden
            </span>
            <span v-else> commentary annotations are shown </span>
          </div>
        </span>
        <span @click="toggleCommentarySync()">
          <div class="mode sync-mode">
            <a :class="[{ active: !syncCommentary }]"> independent </a>
            <a :class="[{ active: syncCommentary }]"> sync </a>
          </div>
          <div class="help">
            <span v-if="!syncCommentary">
              scroll commentary independently
            </span>
            <span v-else> scroll to an annotation when selected </span>
          </div>
        </span>
      </div>
      <div class="toolbar" v-if="showWitnesses">
        <CustomSelect
          v-model="selectedWitness"
          :options="witnesses"
          placeholder="Select an alignment..."
        />
      </div>
      <EmptyMessage v-if="invalidReff">
        View passage at
        <router-link
          :to="{ name: 'reader', params: { urn: healedPassage.toString() } }"
        >
          {{ healedPassage.reference }}
        </router-link>
        to show commentary
      </EmptyMessage>
      <EmptyMessage v-else-if="!filteredLines || filteredLines.length === 0" />
      <template v-else-if="!invalidReff">
        <div
          v-for="[fragment, lines] in filteredFragmentMap"
          :key="fragment"
          class="line"
          :class="{ selected: isMultiSelected(lines) }"
          :id="`line-${lines[0].id}`"
        >
          <div class="fragment" @click.prevent="onSelect(lines[0])">
            <em>
              {{ fragment }}
              <span v-if="lines.length > 1"> ({{ lines.length }}) </span>
            </em>
          </div>
          <template v-if="isMultiSelected(lines)">
            <CommentaryLine v-for="line in lines" :key="line.id" :line="line" />
          </template>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
  import URN, { CustomSelect, EmptyMessage } from '@scaife-viewer/common';

  import gql from 'graphql-tag';

  import {
    MODULE_NS,
    TOGGLE_READER_SYNC_COMMENTARY,
    SET_COMMENTARIES,
    SET_SELECTED_COMMENTARIES,
    CLEAR_SELECTED_COMMENTARIES,
  } from '@scaife-viewer/store';
  import CommentaryLine from './CommentaryLine.vue';
  // TODO: Refactor default ALL_ label to callback too
  const ALL_WITNESSES = { value: null, title: 'All Witnesses' };

  const displayNameCallback = (rootGetters, $scaife) => {
    return $scaife.config.commentaryWidgetLabel || ' Commentary';
  };
  export default {
    scaifeConfig: {
      displayName: displayNameCallback,
    },
    // name: 'CommentaryWidget2',
    // TODO: Provide attribution functionality
    components: {
      EmptyMessage,
      CustomSelect,
      CommentaryLine,
    },
    data() {
      // TODO: Set component local toggle that drives the store
      // to toggle commentary highlighting on / off in the reader.
      return {
        selectedWitness: ALL_WITNESSES,
        witnesses: [],
        commentaryCollectionUrn: this.$scaife.config.commentaryCollectionUrn,
      };
    },
    computed: {
      refDepth() {
        return this.urn.reference.split('-')[0].split('.').length;
      },
      invalidReff() {
        // FIXME: Make compatible with SV1 version
        // return this.refDepth !== 2;
        return false;
      },
      healedPassage() {
        if (this.invalidReff) {
          // const versionUrn = this.urn.upTo('version');
          const versionUrn = this.urn.version;
          const firstRef = this.urn.reference.split('-')[0];
          return this.refDepth === 1
            ? new URN(`${versionUrn}:${firstRef}.1.1`)
            : new URN(`${versionUrn}:${firstRef}.1`);
        }
        return this.urn;
      },
      showCommentary() {
        return this.$store.getters[`${MODULE_NS}/showCommentary`];
      },
      syncCommentary() {
        return this.$store.state[MODULE_NS].syncCommentary;
      },
      showWitnesses() {
        // TODO: tie this into $scaife.config and also set
        // defaults in the widget itself, would require passing upstream
        return false;
      },
      showToolbar() {
        // TODO: Rework this as slots?
        return false;
      },
      show() {
        // TODO: Restore the previous functionality where we used a 404
        // from the server to determine if the widget was shown or not.
        // return this.urn.textGroup === 'stoa0023';
        return true;
      },
      // TODO: regroup lines using fragment, sort_key and ve_refs
      // possibly server side?
      filteredLines() {
        if (this.selectedWitness.value === null) {
          return this.lines;
        }
        const filteredToWitness = this.lines.filter(line => {
          return (
            line.data.witnesses.filter(
              witness => witness.value === this.selectedWitness.value,
            ).length > 0
          );
        });
        return filteredToWitness;
      },
      filteredFragmentMap() {
        const byFragment = new Map();
        this.filteredLines.forEach(line => {
          const key = line.data.fragment;
          const lookupValue = byFragment.get(key) || [];
          lookupValue.push(line);
          byFragment.set(key, lookupValue);
        });
        return byFragment;
      },
      urn() {
        return this.$store.getters[`${MODULE_NS}/urn`];
      },
      selectedCommentaries() {
        return this.$store.state[MODULE_NS].selectedCommentaries || [];
      },
      passage() {
        return this.urn;
      },
      selectedWords() {
        return this.$store.getters['reader/selectedWords'];
      },
    },
    watch: {
      lines: {
        handler() {
          this.updateWitnesses();
        },
      },
      filteredLines: {
        immediate: true,
        handler(newVal) {
          if (newVal) {
            // TODO: Proper mutation
            // OPTION B: Filter via selected lines
            const lookup = this.buildTokenLookup(newVal);
            this.$store.dispatch(`${MODULE_NS}/${SET_COMMENTARIES}`, {
              lookup,
            });
          }
        },
      },
      selectedCommentaries: {
        handler(newVal) {
          if (newVal.length) {
            const id = newVal[0];
            this.$nextTick(() => {
              if (this.syncCommentary) {
                // TODO: Prefer using named refs and a few view events
                const selector = `#line-${id}`;
                const $lineElem = document.querySelector(selector);
                $lineElem.scrollIntoView();

                // TODO: This could / should also be a ref
                const offset = this.$el.parentElement.querySelector(
                  '.sticky-block',
                ).clientHeight;
                this.$el.parentElement.scrollTop -= offset;
              }
            });
          }
        },
      },
    },
    methods: {
      toggleHighlight() {
        const query = {
          ...this.$route.query,
        };

        if (this.showCommentary) {
          delete query.commentary;
        } else {
          query.commentary = 'y';
        }
        this.$router.replace({ query });
      },
      toggleCommentarySync() {
        this.$store.dispatch(`${MODULE_NS}/${TOGGLE_READER_SYNC_COMMENTARY}`);
      },
      onSelect(commentary) {
        // TODO: Prefer actions here
        // this.$store.dispatch('reader/READER_SET_SELECTED_TOKEN', {
        //   token: null,
        // });
        const isCurrentlySelected =
          this.selectedCommentaries.filter(id => commentary.id === id).length >
          0;
        if (isCurrentlySelected) {
          this.$store.dispatch(`${MODULE_NS}/${CLEAR_SELECTED_COMMENTARIES}`);
          // this.$store.dispatch(
          //   `reader/${constants.READER_SET_SELECTED_TOKEN}`,
          //   { token: null },
          // );
        } else {
          this.$store.dispatch(`${MODULE_NS}/${SET_SELECTED_COMMENTARIES}`, {
            commentaries: [commentary.id],
          });
        }
      },
      // TODO: Watch for token changes too?
      // We may need to simplify into its own mode
      isMultiSelected(lines) {
        const selectedIds = lines.map(line => line.id);
        const selected = [];
        selectedIds.forEach(id => {
          selected.push(
            this.selectedCommentaries.filter(entityId => entityId === id)
              .length > 0,
          );
        });
        return selected.filter(selection => selection).length > 0;
      },
      isSelected(id) {
        const value =
          this.selectedCommentaries.filter(entityId => entityId === id).length >
          0;
        // TODO: Tweak this and set this up
        // if (value) {
        //   this.$el.scrollIntoView();
        //   document.querySelector(`#${id}`).scrollIntoView();
        // }

        return value;
      },
      buildTokenLookup(annotations) {
        // FIXME: Namespace tokens with URN due to parallel reader
        const tokenLookup = {};
        annotations
          .filter(annotation => (annotation.data.veRefs || []).length > 0)
          .forEach(annotation => {
            annotation.data.veRefs.forEach(veRef => {
              tokenLookup[veRef] = tokenLookup[veRef] || [];
              tokenLookup[veRef].push(annotation.id);
            });
          });
        return tokenLookup;
      },
      buildWitnesses() {
        const witnessLookup = {};
        this.lines.forEach(line => {
          const witnesses = line.data.witnesses || [{ value: null, label: '' }];
          witnesses.forEach(witness => {
            // FIXME: Clashing IDs?
            witnessLookup[witness.value] = witness;
          });
        });
        // TODO: Sort
        const witnesses = Object.values(witnessLookup).map(witness => ({
          title: witness.label,
          value: witness.value,
        }));
        return witnesses.sort((a, b) => a.title.localeCompare(b.title));
      },
      updateWitnesses() {
        // FIXME: Handle a witness is selected but no longer available;
        // c.f. alignments

        this.witnesses = [ALL_WITNESSES, ...this.buildWitnesses()];
      },
    },
    apollo: {
      lines: {
        query: gql`
          query Commentaries($urn: String!, $collectionUrn: ID) {
            textAnnotations(
              reference: $urn,
              collection_Urn: $collectionUrn,
              kind: "commentary"
            ) {
              edges {
                node {
                  id
                  idx
                  data
                }
              }
            }
          }
        `,
        variables() {
          return {
            urn: `${this.urn}`,
            collectionUrn: this.commentaryCollectionUrn || '',
          };
        },
        update(data) {
          const annotations = data.textAnnotations.edges.map(e => ({
            id: e.node.id,
            idx: e.node.idx,
            data: e.node.data,
          }));
          // return annotations;
          // OPTION A: Annotations always shown
          // const prototypeState = this.$store.state.prototype;
          // prototypeState.commentaryTokensLookup = this.buildTokenLookup(
          //   annotations,
          // );
          // TODO: Add server-side option for sorting
          // TODO: Really need server-side option for sorting
          // TODO: Sorting breaks across references
          // 14.1.1-14.1.2
          // The best sort key is indeed using path / IDX,
          // so we should think about how we want to do that with ingestion.
          // FIXME: fallback
          // TODO: Standardize sorting with SV1
          // return annotations.sort(
          //   (a, b) =>
          //     a.data.sortKey[0][0] - b.data.sortKey[0][0] ||
          //     a.data.sortKey[0][1] - b.data.sortKey[0][1] ||
          //     a.data.sortKey[0][2] - b.data.sortKey[0][2] ||
          //     a.data.sortKey[1] - b.data.sortKey[1],
          // );
          return annotations;
        },
        skip() {
          return this.urn === null || this.invalidReff;
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  // TODO: Standardize color variables
  // across SV packages; standards with fallback probably ok.
  $gray-200: #e9ecef;
  $gray-500: #adb5bd;
  $gray-600: #868e96;
  $gray-700: #495057;
  $black: #000;
  .commentary {
    flex: 1;
  }
  .commentary-container {
    width: 100%;
  }

  .commentary-container-controls {
    // TODO: revisit /refactor with other controls, e.g.
    // text-width-control
    // NOTE: These styles
    .mode a {
      padding: 3px 6px;

      font-family: var(
        --sv-widget-commentary-controls-font-family,
        'Noto Serif'
      );
      font-size: 12px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      cursor: pointer;
      color: $gray-500;
      &.active {
        color: $black;
        &:hover {
          color: $black;
        }
      }
      &:hover {
        color: $gray-700;
        background: $gray-200;
      }
    }
    .sync-mode {
      margin-top: 1em;
    }
    .help {
      margin-left: 6px;
      font-size: 11px;
      color: $gray-600;
    }
  }

  .line {
    font-family: var(--sv-widget-commentaries-font-family, 'Noto Serif');
    font-size: 14px;
    .fragment {
      font-weight: 200;
      color: $gray-600;
      display: flex;
      justify-content: space-between;
      cursor: pointer;
    }
    // TODO: scaife framework setting
    // do we want this widget to do this on hover too?
    margin: 0.375rem 0;

    // TODO: SV1 / SV2 difference with sidebar margin
    padding: 0px 7px;
  }
  .line.selected {
    background: var(
      --sv-widget-commentaries-selected-background-color,
      #f8f9fa
    );
    // TODO: margin-left commented out
    // due to SV 1 / SV 2 difference
    // margin-left: -10px;
    // SV 2
    // .widget-sidebar .body>div {
    //     margin: 0 2em;
    // }
    padding: 3px 7px;
    border-left: 3px solid
      var(--sv-widget-commentaries-selected-border-color, #343a40);
  }
</style>
