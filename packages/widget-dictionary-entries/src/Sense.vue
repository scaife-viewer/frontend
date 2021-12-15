<template>
  <div>
    <div class="sense-block">
      <!-- TODO: Hide toggle option if Sense has no children -->
      <div class="toggle" v-if="hasCitations || hasChildren">
        <span class="expansion-toggle" @click.prevent="onExpand">
          <Icon :name="icon" class="fa-xs" />
        </span>
      </div>
      <div class="no-toggle" v-else />
      <div class="label" v-html="sense.label" />
      <div
        class="definition"
        :class="{ 'definition-condensed': !expanded }"
        v-if="sense.definition"
        v-html="sense.definition"
      ></div>
    </div>
    <ul class="citations" v-if="showCitations && citations.length > 0">
      <Citation
        v-for="citation in citations"
        :key="citation.id"
        :citation="citation"
      />
    </ul>
    <div class="sense-list">
      <div
        class="sense-list-item"
        v-for="child in visibleChildren"
        :key="child.id"
      >
        <Sense
          :treeNode="child"
          :senses="senses"
          :filteredSenses="filteredSenses"
          :parentIsExpanded="expanded"
        />
      </div>
    </div>
  </div>
</template>
<script>
  import {
    MODULE_NS,
    SET_SENSE_EXPANSION,
    SENSE_EXPANSION_EXPANDED,
    SENSE_EXPANSION_COLLAPSED,
    SENSE_EXPANSION_MANUAL,
  } from '@scaife-viewer/store';
  import Citation from './Citation.vue';

  export default {
    name: 'Sense',
    props: {
      treeNode: {
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
      parentIsExpanded: {
        type: Boolean,
        default: false,
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
          if (this.expansionState === SENSE_EXPANSION_COLLAPSED) {
            this.expanded = false;
            return;
          }
          if (this.expansionState === SENSE_EXPANSION_EXPANDED) {
            this.expanded = true;
            return;
          }

          if (this.expansionState === SENSE_EXPANSION_MANUAL) {
            // NOTE: Manual expansion is a no-op;
            return;
          }
          this.expanded = this.expandForPassage;
        },
      },
      parentIsExpanded: {
        immediate: true,
        handler(value) {
          if (this.expansionState === SENSE_EXPANSION_MANUAL && value) {
            // NOTE: Expanding one expands everything
            this.expanded = true;
          }
        },
      },
    },
    components: {
      Citation,
    },
    computed: {
      // TODO: RTL-ize the icon
      icon() {
        return this.expanded ? 'chevron-down' : 'chevron-right';
      },
      citationNodes() {
        return this.sense.citations.edges.map(edge => {
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
      hasCitations() {
        return this.sense && this.sense.citations.edges.length > 0;
      },
      citations() {
        return this.showCitations && this.hasCitations
          ? this.citationNodes
          : [];
      },
      showCitations() {
        return (
          this.$store.state.scaife.citationDisplay !== 'hidden' && this.expanded
        );
      },
      sense() {
        return this.senses.filter(sense => sense.urn === this.treeNode.id)[0];
      },
      hasChildren() {
        return this.treeNode.children && this.treeNode.children.length > 0;
      },
      visibleChildren() {
        return this.expanded ? this.treeNode.children : [];
      },
      expandForPassage() {
        if (this.filteredSenses.length === 0) {
          return false;
        }
        return this.nodeOrDescendantInPassage(this.treeNode);
      },
      expansionState() {
        return this.$store.state[MODULE_NS].senseExpansion;
      },
    },
    methods: {
      onExpand() {
        this.expanded = !this.expanded;

        this.$store.dispatch(`${MODULE_NS}/${SET_SENSE_EXPANSION}`, {
          value: SENSE_EXPANSION_MANUAL,
        });
      },
      inFilteredSenses(urn) {
        return this.filteredSenses.filter(node => urn === node.urn).length > 0;
      },
      nodeOrDescendantInPassage(treeNode) {
        // check to see if the current urn is in filtered senses
        let inPassage = this.inFilteredSenses(treeNode.id);

        if (inPassage) {
          return true;
        }
        if (!treeNode.children) {
          return false;
        }

        for (let i = 0; i < treeNode.children.length; i += 1) {
          const child = treeNode.children[i];
          if (this.nodeOrDescendantInPassage(child)) {
            inPassage = true;
            break;
          }
        }
        return inPassage;
      },
    },
  };
</script>
<style lang="scss" scoped>
  // TODO: Support dynamic depths (if we have depth information)
  // coming back from GraphQL
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
  .no-toggle {
    padding: 0px 4px;
    margin: 0px 2px 0.5em 1em;
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
