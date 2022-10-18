<template>
  <span
    class="token"
    :class="{
      selected,
      interlinear: interlinearMode,
      'entity-mode': namedEntitiesMode,
      'grammatical-entries-mode': grammaticalEntriesMode,
      'dictionary-entries-mode': dictionaryEntriesMode,
      'lemma-cited': citedLemma,
      'lemma-resolved': availableLemma,
      'lemma-excluded': missingLemma,
      entity: namedEntitiesMode && isEntity,
      'selected-entity': namedEntitiesMode && hasSelectedEntity,
      'grammatical-entry': grammaticalEntriesMode && isGrammaticalEntry,
      'selected-grammatical-entry':
        grammaticalEntriesMode && hasSelectedGrammaticalEntry,
      commentary: commentariesMode && isCommentary,
      'selected-commentary': commentariesMode && hasSelectedCommentary,
    }"
    @click="onSelect"
  >
    <template v-if="interlinearMode">
      <span class="ref">{{ token.veRef }}</span>
      <span class="text">{{ token.value || ' ' }}</span>
      <span
        v-if="showAnnotation(SHOW_TRANSLITERATION)"
        class="text-transliterated"
        >{{ token.transliteratedWordValue }}</span
      >
      <span v-if="showAnnotation(SHOW_LEMMA)" class="lemma">{{
        token.lemma || '-'
      }}</span>
      <span v-if="showAnnotation(SHOW_RELATIONSHIP)" class="pos">{{
        token.partOfSpeech || '-'
      }}</span>
      <span v-if="showAnnotation(SHOW_TAG)" class="analysis">{{
        token.tag || '-'
      }}</span>
      <template v-if="hasGlosses">
        <span
          v-if="showAnnotation(SHOW_GLOSS)"
          class="gloss"
          :title="token.glossEng"
          >{{ token.glossEng || '-' }}</span
        >
        <span
          v-if="showAnnotation('showGloss')"
          class="gloss gloss-rtl"
          :title="token.glossFas"
          >{{ token.glossFas || '-' }}</span
        >
      </template>
    </template>
    <template v-else-if="dictionaryEntriesMode">
      <span :title="token.lemma" class="text">{{ token.value }}</span
      >{{ ' ' }}
    </template>
    <template v-else>
      <span class="text">{{ token.value }}</span
      >{{ ' ' }}
    </template>
  </span>
</template>

<script>
  import {
    MODULE_NS,
    SELECT_TOKEN,
    CLEAR_NAMED_ENTITIES,
    SELECT_NAMED_ENTITIES,
    CLEAR_GRAMMATICAL_ENTRIES,
    SELECT_GRAMMATICAL_ENTRIES,
    SET_SELECTED_LEMMAS,
    SET_SELECTED_COMMENTARIES,
    SHOW_TRANSLITERATION,
    SHOW_LEMMA,
    SHOW_RELATIONSHIP,
    SHOW_TAG,
    SHOW_GLOSS,

  } from '@scaife-viewer/store';

  export default {
    props: ['token'],
    methods: {
      onSelect() {
        if (this.selected) {
          this.$store.dispatch(`${MODULE_NS}/${CLEAR_NAMED_ENTITIES}`);
          this.$store.dispatch(`${MODULE_NS}/${CLEAR_GRAMMATICAL_ENTRIES}`);
          this.$store.dispatch(`${MODULE_NS}/${SELECT_TOKEN}`, {
            token: null,
          });
          this.$store.commit(`${MODULE_NS}/${SET_SELECTED_LEMMAS}`, {
            lemmas: null,
          });
          this.$store.dispatch(`${MODULE_NS}/${SET_SELECTED_COMMENTARIES}`, {
            commentaries: this.commentaries,
          });
        } else {
          this.$store.dispatch(`${MODULE_NS}/${SELECT_NAMED_ENTITIES}`, {
            entities: this.entities,
          });
          this.$store.dispatch(`${MODULE_NS}/${SELECT_GRAMMATICAL_ENTRIES}`, {
            entries: this.grammaticalEntries,
          });
          this.$store.dispatch(`${MODULE_NS}/${SELECT_TOKEN}`, {
            token: this.token,
          });
          this.$store.dispatch(`${MODULE_NS}/${SET_SELECTED_COMMENTARIES}`, {
            commentaries: this.commentaries,
          });
        }
      },
      showAnnotation(propertyName) {
        return this.interlinearMode
          ? this.$store.state[MODULE_NS][propertyName]
          : false;
      },
    },
    data() {
      // TODO: Constants versus data?
      return {
        SHOW_TRANSLITERATION,
        SHOW_LEMMA,
        SHOW_RELATIONSHIP,
        SHOW_TAG,
        SHOW_GLOSS,
      };
    },
    computed: {
      commentary() {
        // NOTE: backwards-compatible with SV 1
        return this.commentariesMode;
      },
      veRef() {
        // TODO: For backwards compatibility with SV1
        // Would be good to align the API between major versions.
        return this.token.veRef;
      },
      selectedEntities() {
        return this.$store.state[MODULE_NS].selectedNamedEntities;
      },
      selectedGrammaticalEntries() {
        return this.$store.state[MODULE_NS].selectedGrammaticalEntries;
      },
      interlinearMode() {
        return this.$store.getters[`${MODULE_NS}/interlinearMode`];
      },
      grammaticalEntriesMode() {
        return this.$store.getters[`${MODULE_NS}/grammaticalEntriesMode`];
      },
      namedEntitiesMode() {
        return this.$store.getters[`${MODULE_NS}/namedEntitiesMode`];
      },
      dictionaryEntriesMode() {
        return this.$store.getters[`${MODULE_NS}/dictionaryEntriesMode`];
      },
      // TODO: Splat from store; revisit docs
      commentariesMode() {
        return this.$store.getters[`${MODULE_NS}/commentariesMode`];
      },
      entities() {
        return (this.token && this.token.entities) || [];
      },
      isEntity() {
        return this.entities.length > 0;
      },
      hasSelectedEntity() {
        return (
          this.entities.filter(
            id => this.selectedEntities.filter(sid => sid === id).length > 0,
          ).length > 0
        );
      },
      grammaticalEntries() {
        return (this.token && this.token.grammaticalEntries) || [];
      },
      isGrammaticalEntry() {
        return this.grammaticalEntries.length > 0;
      },
      hasSelectedGrammaticalEntry() {
        return (
          this.grammaticalEntries.filter(
            id =>
              this.selectedGrammaticalEntries.filter(sid => sid === id).length >
              0,
          ).length > 0
        );
      },
      selected() {
        if (!this.selectedToken) {
          return false;
        }
        if (this.namedEntitiesMode) {
          const { entities, veRef } = this.selectedToken;
          const entity = entities[0];
          return (
            veRef === this.token.veRef ||
            (entity && entity === this.entities[0])
          );
        }
        if (this.grammaticalEntriesMode) {
          const { grammaticalEntries, veRef } = this.selectedToken;
          const entry = grammaticalEntries[0];
          return (
            veRef === this.token.veRef ||
            (entry && entry === this.grammaticalEntries[0])
          );
        }
        // TODO: Colors for dictionary entries mode
        return this.selectedToken.veRef === this.token.veRef;
      },
      selectedToken() {
        return this.$store.state[MODULE_NS].selectedToken;
      },
      passage() {
        return this.$store.getters[`${MODULE_NS}/passage`];
      },
      hasGlosses() {
        return this.passage.textGroup === 'tlg0012';
      },
      showCitedLemmas() {
        return this.$store.state[MODULE_NS].showCitedLemmas;
      },
      showAvailableLemmas() {
        return this.$store.state[MODULE_NS].showAvailableLemmas;
      },
      showMissingLemmas() {
        return this.$store.state[MODULE_NS].showMissingLemmas;
      },
      citedLemma() {
        return (
          this.dictionaryEntriesMode &&
          this.token.lemmaCited &&
          this.showCitedLemmas
        );
      },
      availableLemma() {
        return (
          this.dictionaryEntriesMode &&
          !this.token.lemmaCited &&
          this.token.lemmaResolved &&
          this.showAvailableLemmas
        );
      },
      missingLemma() {
        return (
          this.dictionaryEntriesMode &&
          !this.token.lemmaResolved &&
          !this.token.lemmaCited &&
          this.showMissingLemmas
        );
      },
      highlightCommentaries() {
        return this.$store.getters[`${MODULE_NS}/showCommentary`];
      },
      // syncCommentary() {
      //   // TODO: Integrate this with the "scroll to" affordance
      //   //
      //   return this.$store.state[MODULE_NS].syncCommentary;
      // },
      commentaries() {
        if (!this.commentary) {
          return [];
        }
        const { commentariesHash } = this.$store.state[MODULE_NS];
        return commentariesHash[this.veRef] || [];
      },
      isCommentary() {
        return this.commentaries.length > 0;
      },
      selectedCommentaries() {
        return this.$store.state[MODULE_NS].selectedCommentaries || [];
      },
      hasSelectedCommentary() {
        return (
          this.commentaries.filter(
            id =>
              this.selectedCommentaries.filter(sid => sid === id).length > 0,
          ).length > 0
        );
      },
    },
  };
</script>

<style lang="scss" scoped>
  $interlinear-font-family: 'Lucida Console', Monaco, monospace;

  .token .text {
    cursor: pointer;
  }
  .token.selected .text {
    box-shadow: 0 -10px 0px var(
        --sv-widget-reader-token-selected-shadow-color,
        #6ff
      ) inset;
  }
  .token.entity-mode:not(.entity) .text {
    cursor: inherit;
  }
  .token.entity .text,
  .token.grammatical-entry .text,
  .token.commentary .text {
    box-shadow: 0 -10px 0px var(
        --sv-widget-reader-token-entity-shadow-color,
        #ff6
      ) inset;
  }
  // TODO: revisit highlight / selection implementation
  .token.selected-entity .text,
  .token.selected-grammatical-entry .text,
  .token.selected-commentary .text {
    box-shadow: 0 -10px 0px var(
        --sv-widget-reader-token-selected-entity-shadow-color,
        #9f9
      ) inset;
  }
  :not(.token.selected) {
    &.token.lemma-cited .text {
      background-color: var(
        --sv-widget-reader-dictionary-cited-background-color,
        #92fade
      );
    }
    &.token.lemma-resolved .text {
      background-color: var(
        --sv-widget-reader-dictionary-resolved-background-color,
        #9ad5f5
      );
    }
    &.token.lemma-excluded .text {
      background-color: var(
        --sv-widget-reader-dictionary-excluded-background-color,
        #facba6
      );
    }
  }
  .token.interlinear {
    display: inline-block;
    padding: 2px 4px;
    margin: 0 4px 10px;
    > span {
      display: block;
    }
    .ref {
      font-family: var(
        --sv-widget-reader-interlinear-ref-font-family,
        $interlinear-font-family
      );
      font-size: 0.55em;
      color: var(--sv-widget-reader-interlinear-ref-text-color, #999);
    }
    .text {
      font-size: 1em;
      font-weight: 700;
      color: var(--sv-widget-reader-interlinear-text-color, #000);
    }
    .text-transliterated {
      font-family: 'Arial';
    }
    .lemma {
      font-size: 0.88em;
      color: var(--sv-widget-reader-interlinear-lemma-text-color, #333);
    }
    .pos {
      font-size: 0.77em;
      color: var(--sv-widget-reader-interlinear-pos-text-color, #999);
    }
    .analysis {
      font-family: var(
        --sv-widget-reader-interlinear-analysis-font-family,
        $interlinear-font-family
      );
      font-size: 0.66em;
      color: var(--sv-widget-reader-interlinear-analysis-text-color, #999);
    }
    .gloss {
      font-size: 0.88em;
      color: var(--sv-widget-reader-interlinear-gloss-text-color, #333);
      font-style: italic;
      // NOTE: This prevents long glosses from
      // breaking the interlinear layout
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 20ch;
    }
    .gloss-rtl {
      direction: rtl;
      font-family: var(
        --sv-widget-reader-interlinear-gloss-font-family-rtl,
        'Amiri',
        'Noto Sans'
      );
      font-style: initial;
      font-size: 24px;
      line-height: 1.7;
    }
  }
</style>
