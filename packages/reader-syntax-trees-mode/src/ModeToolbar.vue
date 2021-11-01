<template>
  <div class="syntax-trees-toolbar">
    <a class="tree-toggle" href @click.prevent="onShow">
      <icon :name="iconName" />
      {{ expanded ? 'Collapse All Trees' : 'Expand All Trees' }}
    </a>
    <div class="attr-toggles">
      <!-- TODO: show / hide toggles based on underlying collection data -->
      <a
        title="Lemma"
        :class="{ active: showLemma }"
        @click.prevent="showLemma = !showLemma"
      >
        Lemma
      </a>
      <!-- TODO: Enable gloss -->
      <a
        v-if="false"
        title="Gloss"
        :class="{ active: showGloss }"
        @click.prevent="showGloss = !showGloss"
      >
        Gloss
      </a>
      <a
        title="Relationship"
        :class="{ active: showRelationship }"
        @click.prevent="showRelationship = !showRelationship"
      >
        Relationship
      </a>
      <a
        title="Tag"
        :class="{ active: showTag }"
        @click.prevent="showTag = !showTag"
      >
        Tag
      </a>
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

    a {
      margin: 0 0.5rem;
      padding: 0.25rem;
      border-radius: 3px;
    }

    .tree-toggle {
      margin: 0;
    }

    .attr-toggles {
      display: flex;
      a {
        font-size: 14px;
        text-align: center;
        cursor: pointer;
      }
      a.active {
        font-weight: 700;
        background: var(
          --sv-syntax-trees-mode-toolbar-link-background-color,
          #b45141
        );
        color: var(--sv-syntax-trees-mode-toolbar-link-text-color, #fff);
      }
      // NOTE: Prevents a shift due to font-weight change
      a::before {
        display: block;
        content: attr(title);
        font-weight: 700;
        height: 0;
        overflow: hidden;
        visibility: hidden;
      }
    }
  }
</style>
