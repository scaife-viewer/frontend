<template>
  <div class="syntax-trees-toolbar">
    <a class="tree-toggle" href @click.prevent="onShow">
      <icon :name="iconName" />
      {{ expanded ? 'Collapse All Trees' : 'Expand All Trees' }}
    </a>
    <div class="attr-toggles">
      <!-- TODO: show / hide toggles based on underlying collection data -->
      <span
        :class="{ active: showLemma }"
        @click.prevent="showLemma = !showLemma"
      >
        Lemma
      </span>
      <!-- TODO: Enable gloss -->
      <span
        v-if="false"
        :class="{ active: showGloss }"
        @click.prevent="showGloss = !showGloss"
      >
        Gloss
      </span>
      <span
        :class="{ active: showRelationship }"
        @click.prevent="showRelationship = !showRelationship"
      >
        Relationship
      </span>
      <span :class="{ active: showTag }" @click.prevent="showTag = !showTag">
        Tag
      </span>
    </div>
  </div>
</template>

<script>
  import { MODULE_NS } from '@scaife-viewer/store';
  import { MODE_EXPAND, MODE_COMPRESS } from './constants';

  export default {
    props: ['expandAll'],
    methods: {
      onShow() {
        this.$emit(
          'show',
          [null, MODE_COMPRESS].indexOf(this.expandAll) > -1
            ? MODE_EXPAND
            : MODE_COMPRESS,
        );
      },
    },
    computed: {
      active() {
        return this.expandAll !== null;
      },
      iconName() {
        return this.expandAll || MODE_EXPAND;
      },
      expanded() {
        return this.expandAll === MODE_EXPAND;
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
      showTag: {
        get() {
          return this.$store.state[MODULE_NS].showTag;
        },
        set() {
          this.$store.state[MODULE_NS].showTag = !this.$store.state[MODULE_NS]
            .showTag;
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
      showGloss: {
        get() {
          return this.$store.state[MODULE_NS].showGloss;
        },
        set() {
          this.$store.state[MODULE_NS].showGloss = !this.$store.state[MODULE_NS]
            .showGloss;
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  .syntax-trees-toolbar {
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
