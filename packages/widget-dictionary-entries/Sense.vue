<template>
  <div :class="[`depth-${sense.depth}`]">
    <div class="sense-block">
      <div class="toggle">
        <button class="expansion-toggle" @click.prevent="onExpand">
          {{ expandedToggleClass }}
        </button>
      </div>
      <div class="label">
        {{ sense.label }}
      </div>
      <div class="definition" :class="{'definition-condensed': !expanded}" v-if="sense.definition" v-html="sense.definition"></div>
    </div>
    <ul class="citations" v-if="citations.length > 0">
      <Citation
        v-for="citation in citations"
        :key="citation.id"
        :citation="citation"
      />
    </ul>
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
    props: {
      sense: {
        type: Object,
        required: true,
      },
      filteredSenses: {
        type: Array,
        reqired: true,
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
      expandedToggleClass() {
        // TODO: Iconify
        return this.expanded ? '\u02c5' : '\u02c3';
      },
      citations() {
        const hasCitations =
          this.sense && this.sense.citations.edges.length > 0 && this.showCitations;
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
        return this.$store.state['scaife'].citationDisplay != 'hidden' && this.expanded;
      }
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
  }
  .sense-block {
    display: flex;
    flex-wrap: none;
    .label {
      font-weight: 600;
    }
    .label, .definition {
      margin-inline-start: 0.5em;
    }
    .definition-condensed {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
