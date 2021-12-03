<template>
  <span
    class="token"
    :class="{
      selected,
      interlinear: interlinearMode,
      'entity-mode': namedEntitiesMode,
      entity: namedEntitiesMode && isEntity,
      'selected-entity': namedEntitiesMode && hasSelectedEntity,
    }"
    @click="onSelect"
  >
    <template v-if="interlinearMode">
      <span class="ref">{{ token.veRef }}</span>
      <span class="text">{{ token.value }}</span>
      <span class="lemma">{{ token.lemma || '-' }}</span>
      <span class="pos">{{ token.partOfSpeech || '-' }}</span>
      <span class="analysis">{{ token.tag || '-' }}</span>
      <template v-if="hasGlosses">
        <span class="gloss" :title="token.glossEng">{{
          token.glossEng || '-'
        }}</span>
        <span class="gloss gloss-rtl" :title="token.glossFas">{{
          token.glossFas || '-'
        }}</span>
      </template>
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
  } from '@scaife-viewer/store';

  export default {
    props: ['token'],
    methods: {
      onSelect() {
        if (this.selected) {
          this.$store.dispatch(`${MODULE_NS}/${CLEAR_NAMED_ENTITIES}`);
          this.$store.dispatch(`${MODULE_NS}/${SELECT_TOKEN}`, {
            token: null,
          });
        } else if (
          (this.namedEntitiesMode && this.isEntity) ||
          !this.namedEntitiesMode
        ) {
          this.$store.dispatch(`${MODULE_NS}/${SELECT_NAMED_ENTITIES}`, {
            entities: this.entities,
          });
          this.$store.dispatch(`${MODULE_NS}/${SELECT_TOKEN}`, {
            token: this.token,
          });
        }
      },
    },
    computed: {
      selectedEntities() {
        return this.$store.state[MODULE_NS].selectedNamedEntities;
      },
      interlinearMode() {
        return this.$store.getters[`${MODULE_NS}/interlinearMode`];
      },
      namedEntitiesMode() {
        return this.$store.getters[`${MODULE_NS}/namedEntitiesMode`];
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
        return this.selectedToken.veRef === this.token.veRef;
      },
      selectedToken() {
        return this.$store.state[MODULE_NS].selectedToken;
      },
      passage() {
        return this.$store.getters[`${MODULE_NS}/passage`];
      },
      hasGlosses() {
        return (
          this.passage.version ===
          'urn:cts:greekLit:tlg0012.tlg001.perseus-grc2:'
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
  .token.entity .text {
    box-shadow: 0 -10px 0px var(
        --sv-widget-reader-token-entity-shadow-color,
        #ff6
      ) inset;
  }
  .token.selected-entity .text {
    box-shadow: 0 -10px 0px var(
        --sv-widget-reader-token-selected-entity-shadow-color,
        #9f9
      ) inset;
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
