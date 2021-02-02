<template>
  <div>
    <div class="sense-block">
      <!-- TODO: Allow a toggle if no children? -->
      <div class="toggle">
        <span class="expansion-toggle" @click.prevent="onExpand">
          <Icon :name="icon" class="fa-xs" />
        </span>
      </div>
      <div class="label" v-html="sense.label" />
      <div
        class="definition"
        :class="{ 'definition-condensed': !expanded }"
        v-if="sense.definition"
        v-html="sense.definition"
      ></div>
    </div>
    <ul class="citations" v-if="citations.length > 0">
      <Citation
        v-for="citation in citations"
        :key="citation.id"
        :citation="citation"
      />
    </ul>
    <div class="sense-list">
      <div class="sense-list-item" v-for="entry in entry.children" :key="entry.id">
        <Sense
          :entry="entry"
          :senses="senses"
          :filteredSenses="filteredSenses"
        />
      </div>
    </div>
  </div>
</template>
<script>
  import Citation from './Citation.vue';
  import {
    MODULE_NS,
    SET_SENSE_EXPANSION,
    SENSE_EXPANSION_MANUAL,
  } from '@scaife-viewer/store';
  export default {
    name: 'Sense',
    props: {
      entry: {
        type: Object,
        required: true,
      },
      filteredSenses: {
        type: Array,
        required: true,
      },
      senses: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        // NOTE: Determined by filteredSenses watcher
        expanded: false,
      };
    },
    watch: {
      filteredSenses: {
        immediate: true,
        handler() {
          if (
            this.$store.state[MODULE_NS].senseExpansion ===
            SENSE_EXPANSION_MANUAL
          ) {
            // NOTE: Manual expansion is a no-op;
            return;
          }
          if (
            this.filteredSenses.filter(node => this.sense.id === node.id)
              .length > 0
          ) {
            this.expanded = true;
          } else {
            this.expanded = false;
          }
        },
      },
    },
    components: {
      Citation,
    },
    computed: {
      // TODO: RTL ize
      icon() {
        return this.expanded ? 'chevron-down' : 'chevron-right';
      },
      citations() {
        const hasCitations =
          this.sense &&
          this.sense.citations.edges.length > 0 &&
          this.showCitations;
        return !hasCitations
          ? []
          : this.sense.citations.edges.map(edge => {
              const { id, urn, ref, quote, passageUrn } = edge.node;
              return {
                id,
                urn,
                ref,
                quote,
                passageUrn,
              };
            });
      },
      showCitations() {
        return (
          this.$store.state['scaife'].citationDisplay != 'hidden' &&
          this.expanded
        );
      },
      sense() {
        return this.senses.filter(sense => sense.urn == this.entry.id)[0];
      },
    },
    methods: {
      onExpand() {
        this.expanded = !this.expanded;

        this.$store.dispatch(`${MODULE_NS}/${SET_SENSE_EXPANSION}`, {
          value: SENSE_EXPANSION_MANUAL,
        });
      },
    },
  };
</script>
<style lang="scss" scoped>
  // TODO: Dynamic (if we get the right GraphQL response)
  .depth-1 {
    margin-left: 0.3em;
  }
  .depth-2 {
    margin-left: 0.6em;
  }
  .depth-3 {
    margin-left: 0.9em;
  }
  .depth-4 {
    margin-left: 1.2em;
  }
  .depth-5 {
    margin-left: 1.5em;
  }
  .depth-6 {
    margin-left: 1.8em;
  }
  .depth-7 {
    margin-left: 2.1em;
  }
  .expansion-toggle {
    padding: 0px 4px;
    margin: 0px 2px 0.5em 0px;
    color: var(--sv-widget-dictionary-entries-open-toggle-text-color, #ced4da);
    &:hover {
      color: var(
        --sv-widget-dictionary-entries-open-toggle-hover-text-color,
        #495057
      );
    }
  }
  .sense-block {
    display: flex;
    flex-wrap: none;
    .label {
      font-weight: 600;
    }
    .definition {
      margin-inline-start: 0.5em;
    }
    .definition-condensed {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .sense-list {
    padding-inline-start: 10px;
  }
  ul.citations {
    list-style-type: circle;
  }
</style>
