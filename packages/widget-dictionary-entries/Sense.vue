<template>
  <div :class="[`depth-${sense.depth}`]">
    <button class="expansion-toggle" @click.prevent="onExpand">
      {{ expandedToggleClass }}
    </button>
    {{ sense.label }}
    <div v-if="expanded">
      <div
        class="definition"
        v-if="sense.definition"
        v-html="sense.definition"
      />
      <ul v-if="citations.length > 0">
        <Citation
          v-for="citation in citations"
          :key="citation.id"
          :citation="citation"
        />
      </ul>
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
          this.sense && this.sense.citations.edges.length > 0;
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
    margin-left: 0.5em;
  }
  .depth-2 {
    margin-left: 1em;
  }
  .depth-3 {
    margin-left: 1.5em;
  }
  .depth-4 {
    margin-left: 2em;
  }
  .depth-5 {
    margin-left: 2.5em;
  }
  .depth-6 {
    margin-left: 3em;
  }
  .depth-7 {
    margin-left: 3.5em;
  }
  .definition {
    padding: 5px;
    color: gray;
  }
  .expansion-toggle {
    padding: 0px 4px;
    margin: 0px 2px 0.5em 0px;
  }
</style>
