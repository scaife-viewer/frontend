<template>
  <div class="interlinear-mode-toolbar">
    <div class="attr-toggles">
      <!-- TODO: show / hide toggles based on underlying collection data -->
      <!-- TODO: Factor out further common -->
      <span
        v-for="([propertyName, label], toggleIdx) in toggles"
        :key="toggleIdx"
        :class="{ active: isActive(propertyName) }"
        @click.prevent="toggleProperty(propertyName)"
      >
        {{ label }}
      </span>
    </div>
  </div>
</template>

<script>
  import {
    MODULE_NS,
    SHOW_MORPH_TAG,
    SHOW_GRAMMATICAL_TAGS,
  } from '@scaife-viewer/store';
  import { TOKEN_ANNOTATION_TOGGLES } from '@scaife-viewer/common';

  export default {
    props: ['expandAll'],
    data() {
      return { toggles: TOKEN_ANNOTATION_TOGGLES };
    },
    methods: {
      toggleProperty(propertyName) {
        this[[propertyName]] = !this[propertyName];
      },
      isActive(propertyName) {
        return this[[propertyName]];
      },
    },
    computed: {
      active() {
        return this.expandAll !== null;
      },
      showRelationship: {
        get() {
          return this.$store.state[MODULE_NS].showRelationship;
        },
        set() {
          this.$store.state[MODULE_NS].showRelationship = !this.$store.state[
            MODULE_NS
          ].showRelationship;
        },
      },
      showMorphTag: {
        get() {
          return this.$store.state[MODULE_NS][SHOW_MORPH_TAG];
        },
        set() {
          this.$store.state[MODULE_NS][SHOW_MORPH_TAG] = !this.$store.state[
            MODULE_NS
          ][SHOW_MORPH_TAG];
        },
      },
      [SHOW_GRAMMATICAL_TAGS]: {
        get() {
          return this.$store.state[MODULE_NS][SHOW_GRAMMATICAL_TAGS];
        },
        set() {
          this.$store.state[MODULE_NS][SHOW_GRAMMATICAL_TAGS] = !this.$store
            .state[MODULE_NS][SHOW_GRAMMATICAL_TAGS];
        },
      },
      showLemma: {
        get() {
          return this.$store.state[MODULE_NS].showLemma;
        },
        set() {
          this.$store.state[MODULE_NS].showLemma = !this.$store.state[MODULE_NS]
            .showLemma;
        },
      },
      showTransliteration: {
        get() {
          return this.$store.state[MODULE_NS].showTransliteration;
        },
        set() {
          this.$store.state[MODULE_NS].showTransliteration = !this.$store.state[
            MODULE_NS
          ].showTransliteration;
        },
      },
      showGloss: {
        get() {
          return this.$store.state[MODULE_NS].showGloss;
        },
        set() {
          this.$store.state[MODULE_NS].showGloss = !this.$store.state[MODULE_NS]
            .showGloss;
        },
      },
      passage() {
        return this.$store.getters[`${MODULE_NS}/passage`];
      },
      hasGlosses() {
        // FIXME: Derive this from an associated collection, not
        // a hard-coded value
        return this.passage.textGroup === 'tlg0012';
      },
    },
  };
</script>

<style lang="scss" scoped>
  .interlinear-mode-toolbar {
    display: flex;
    justify-content: space-between;
    padding-bottom: 0.75rem;

    .tree-toggle {
      padding: 0.25rem;
      margin: 0;
    }

    .attr-toggles {
      display: flex;
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
      }
    }
  }
</style>
