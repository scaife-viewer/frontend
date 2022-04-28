<template>
  <base-widget v-if="show" class="commentary">
    <span slot="header">
      Commentary
    </span>
    <!-- TODO: Fix min height issues -->
    <div slot="body">
      <div :key="urn.absolute" class="commentary-container">
        <!-- TODO: Put these behind a cog and revisit labels -->
        <!-- Sync mode scroll to token could change the icon color -->
        <span @click="toggleHighlight()">
          <div class="mode">
            <a :class="[{ active: !showCommentary }]">
              hide
            </a>
            <a :class="[{ active: showCommentary }]">
              show
            </a>
          </div>
          <div class="help">
            <span v-if="!showCommentary">
              commentary annotations are hidden
            </span>
            <span v-else>
              commentary annotations are shown
            </span>
          </div>
        </span>
        <span @click="toggleCommentarySync()">
          <div style="margin-top: 1.0em;" class="mode">
            <a :class="[{ active: !syncCommentary }]">
              independent
            </a>
            <a :class="[{ active: syncCommentary }]">
              sync
            </a>
          </div>
          <div class="help">
            <span v-if="!syncCommentary">
              scroll commentary independently
            </span>
            <span v-else>
              scroll to an annotation when selected
            </span>
          </div>
        </span>
        <div class="toolbar">
          <!-- TODO: Fix z-index issues -->
          <CustomSelect
            v-model="selectedWitness"
            class="bootstrap-override"
            :options="witnesses"
            placeholder="Select an alignment..."
            style="z-index: 1001"
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
        <EmptyMessage
          v-else-if="!filteredLines || filteredLines.length === 0"
        />
        <template v-else-if="!invalidReff">
          <div
            v-for="[fragment, lines] in filteredFragmentMap"
            :key="fragment"
            class="line"
            :class="{ selected: isMultiSelected(lines) }"
          >
            <div class="fragment" @click.prevent="onSelect(lines[0])">
              <em>
                {{ fragment }}
                <span v-if="lines.length > 1"> ({{ lines.length }}) </span>
                <!-- TODO: For debugging -->
                <!-- {{ lines[0].data.sortKey.toLocaleString() }} -->
              </em>
              <!-- TODO: Revisit with CompiledInlineToken -->
              <!-- <span v-if="isMultiSelected(lines)"><icon name="location-arrow" /></span> -->
            </div>
            <template v-if="isMultiSelected(lines)">
              <CommentaryLine
                v-for="line in lines"
                :key="line.id"
                :line="line"
              />
            </template>
          </div>
        </template>
        <!-- TODO: Provide attribution information; may not be required everywhere -->
      </div>
    </div>
  </base-widget>
</template>
<script>
  import URN, {
    Attribution,
    CustomSelect,
    EmptyMessage,
  } from '@scaife-viewer/common';

  import gql from 'graphql-tag';

  import { MODULE_NS } from '@scaife-viewer/store';
  // import constants from '../../constants';
  import CommentaryLine from './CommentaryLine.vue';

  const ALL_WITNESSES = { value: null, title: 'All Witnesses' };

  export default {
    name: 'WidgetCommentary',
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
      };
    },
    computed: {
      refDepth() {
        return this.passage.urn.reference.split('-')[0].split('.').length;
      },
      invalidReff() {
        return this.refDepth !== 3;
      },
      healedPassage() {
        if (this.invalidReff) {
          const versionUrn = this.passage.urn.upTo('version');
          const firstRef = this.passage.urn.reference.split('-')[0];
          return this.refDepth === 1
            ? new URN(`${versionUrn}:${firstRef}.1.1`)
            : new URN(`${versionUrn}:${firstRef}.1`);
        }
        return this.passage.urn;
      },
      showCommentary() {
        return this.$store.getters['reader/showCommentary'];
      },
      syncCommentary() {
        const value = this.$store.state.reader.syncCommentary;
        // TODO: getters, etc;
        console.log(`[DEBUG] Sync commentary token: ${value}`);
        return value;
      },
      show() {
        // TODO: Restore the previous functionality where we used a 404
        // from the server to determine if the widget was shown or not.
        return (
          this.$store.getters['reader/passage'].urn.textGroup === 'stoa0023'
        );
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
          const key = line.data.fragmentVerbose;
          const lookupValue = byFragment.get(key) || [];
          lookupValue.push(line);
          byFragment.set(key, lookupValue);
        });
        return byFragment;
      },
      urn() {
        // return this.$store.getters[`${MODULE_NS}/urn`];
        return this.passage.urn;
      },
      selectedCommentaries() {
        return this.$store.state.reader.selectedCommentaries || [];
      },
      passage() {
        return this.$store.getters['reader/passage'];
      },
      selectedWords() {
        return this.$store.getters['reader/selectedWords'];
      },
    },
    watch: {
      selectedWords: {
        handler(newVal) {
          // TODO: backport from SV2 (which will require further
          // hash map manipulation)
          // if (this.selectedCommentaries) {
          //   debugger;
          //   this.$store.state.prototype.selectedCommentaries = [];
          // }
        },
      },
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
            this.$store.dispatch('reader/READER_SET_COMMENTARIES', { lookup });
          }
        },
      },
      selectedCommentaries: {
        handler(newVal) {
          if (newVal.length) {
            const id = newVal[0];
            this.$nextTick(() => {
              if (this.syncCommentary) {
                this.$el.scrollIntoView();
                document.querySelector(`#${id}`).scrollIntoView();
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
        this.$store.commit('reader/READER_TOGGLE_SYNC_COMMENTARY');
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
          this.$store.dispatch('reader/READER_CLEAR_SELECTED_COMMENTARIES');
          // this.$store.dispatch(
          //   `reader/${constants.READER_SET_SELECTED_TOKEN}`,
          //   { token: null },
          // );
        } else {
          this.$store.dispatch('reader/READER_SET_SELECTED_COMMENTARIES', {
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
          line.data.witnesses.forEach(witness => {
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
          query Scholia($urn: String!) {
            textAnnotations(reference: $urn) {
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
          return { urn: `${this.urn}` };
        },
        update(data) {
          const annotations = data.textAnnotations.edges.map(e => ({
            id: e.node.id,
            idx: e.node.idx,
            data: e.node.data,
          }));

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
          return annotations.sort(
            (a, b) =>
              a.data.sortKey[0][0] - b.data.sortKey[0][0] ||
              a.data.sortKey[0][1] - b.data.sortKey[0][1] ||
              a.data.sortKey[0][2] - b.data.sortKey[0][2] ||
              a.data.sortKey[1] - b.data.sortKey[1],
          );
        },
        skip() {
          return this.urn === null || this.invalidReff;
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  .commentary-container {
    width: 100%;
  }
  .line {
    font-family: var(--sv-widget-scholia-line-font-family, 'Noto Serif');
    font-size: 14px;
    .fragment {
      font-weight: 200;
      color: gray;
      display: flex;
      justify-content: space-between;
    }
    // TODO: scaife framework setting
    // do we want this widget to do this on hover too?
    margin: 0.375rem 0;
  }
  .line.selected {
    background: var(
      --sv-widget-commentaries-selected-background-color,
      #f8f9fa
    );
    // margin-left: -10px;
    padding: 3px 7px;
    border-left: 3px solid
      var(--sv-widget-commentaries-selected-border-color, #343a40);
  }
</style>
