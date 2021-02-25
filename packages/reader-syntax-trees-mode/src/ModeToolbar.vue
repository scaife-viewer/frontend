<template>
  <div class="syntax-trees-toolbar">
    <a href :class="{ active }" @click.prevent="onShow">
      <icon :name="iconName" />
      {{ expanded ? 'Collapse All' : 'Expand All' }}
    </a>
    <div class="toggles">
      <!-- TODO: show / hide toggles based on underlying data -->
      <div class="toggle">
        <div class="show-lemma-toggle">
          <input
            class="tgl tgl-flat"
            id="toggle-lemma"
            type="checkbox"
            v-model="showLemma"
          />
          <label class="tgl-btn" for="toggle-lemma">Lemma</label>
        </div>
      </div>
      <div class="toggle">
        <div class="show-gloss-toggle">
          <input
            class="tgl tgl-flat"
            id="toggle-gloss"
            type="checkbox"
            v-model="showGloss"
          />
          <label class="tgl-btn" for="toggle-gloss">Gloss</label>
        </div>
      </div>
      <div class="toggle">
        <div class="show-relation-toggle">
          <input
            class="tgl tgl-flat"
            id="toggle-relation"
            type="checkbox"
            v-model="showRelationship"
          />
          <label class="tgl-btn" for="toggle-relation">Relationship</label>
        </div>
      </div>
      <div class="toggle">
        <div class="show-tag-toggle">
          <input
            class="tgl tgl-flat"
            id="toggle-tag"
            type="checkbox"
            v-model="showTag"
          />
          <label class="tgl-btn" for="toggle-tag">Tag</label>
        </div>
      </div>
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
    display: grid;
    grid-template-columns: 33% 1fr;
    padding-bottom: 0.75rem;

    a:active {
      outline: none;
    }
    a:hover {
      border-color: var(
        --sv-syntax-trees-mode-toolbar-link-hover-border-color,
        #b45141
      );
    }
    a.active {
      border-color: transparent;
    }
    .toggles {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }
    .toggle {
      margin-inline-start: 3em;
    }
  }
</style>
