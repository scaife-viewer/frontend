<template>
  <li>
    <div class="node-container" :class="{ highlight }">
      <template v-if="hasChildren">
        <span class="open-toggle" @click.prevent="toggle">
          <Icon :name="icon" class="fa-xs" />
        </span>
      </template>

      <span class="node version text-overflow" v-if="routable">
        <ReaderLink :title="metadata.label" :urn="fallbackUrn" :noQuery="true">
          {{ metadata.label }}
        </ReaderLink>
      </span>
      <span v-else class="node parent text-overflow">
        <tt :title="metadata.label">{{ metadata.label }}</tt>
      </span>
    </div>

    <ul class="node-tree" v-if="expanded">
      <Node v-for="(node, index) in node.children" :key="index" :node="node" />
    </ul>
  </li>
</template>

<script>
  import { ReaderLink } from '@scaife-viewer/common';
  import { MODULE_NS } from '@scaife-viewer/store';

  export default {
    name: 'Node',
    props: ['node'],
    components: { ReaderLink },
    data() {
      return {
        expanded: false,
      };
    },
    watch: {
      readerUrn: {
        immediate: true,
        handler() {
          if (this.nodeUrnIndex > -1) {
            this.expanded = true;
          } else {
            // FIXME: Backwards incompatible change
            // This is being done so that when we navigate to a new
            // passage, we close up the expansion toggles.
            // This could be site / user-configurable.
            this.expanded = false;
          }
        },
      },
    },
    computed: {
      highlight() {
        return this.readerUrn && this.readerUrn.version === this.urn;
      },
      nodeUrnIndex() {
        return (
          this.readerUrn &&
          this.readerUrn.absolute.indexOf(
            this.urn.slice(0, this.urn.length - 1), // trim trailing colon
          )
        );
      },
      fallbackUrn() {
        // FIXME: Remove once we have firstPassageUrn set
        return this.metadata.firstPassageUrn || this.urn;
      },
      readerUrn() {
        return this.$store.getters[`${MODULE_NS}/urn`];
      },
      urn() {
        // TODO: Cast to URN post-refactor.
        return this.node.data.urn;
      },
      kind() {
        return this.node.data.kind;
      },
      metadata() {
        return this.node.data.metadata;
      },
      routable() {
        return this.kind === 'version';
      },
      icon() {
        return this.expanded ? 'chevron-down' : 'chevron-right';
      },
      hasChildren() {
        return this.node.children && this.node.children.length;
      },
    },
    methods: {
      toggle() {
        this.expanded = !this.expanded;
      },
    },
  };
</script>

<style lang="scss" scoped>
  li {
    margin-top: 0.33em;
  }
  span {
    text-decoration: none;
    &.open-toggle {
      color: var(--sv-widget-library-open-toggle-text-color, #ced4da);
      padding: 0 0.33em 0 0;
      &:hover {
        color: var(--sv-widget-library-open-toggle-hover-text-color, #495057);
      }
    }
  }
  .highlight {
    font-weight: 700;
  }
  .node-container {
    display: flex;
  }
  .node {
    overflow: hidden;
    &.text-overflow {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    &.version {
      margin-left: 0.5em;
      font-size: 0.8em;
    }
    &.parent {
      > tt {
        font-family: inherit;
      }
    }
  }
</style>
