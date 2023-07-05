<template>
  <div class="toc-widget" :class="{ 'with-entries': toc }">
    <LoaderBall v-if="$apollo.loading" />
    <EmptyMessage v-else-if="!toc">
      {{ emptyMessage }}
    </EmptyMessage>
    <div class="toc-entries" :key="currentToc" v-else>
      <div class="lookahead-container">
        <Lookahead
          :placeholder="placeholder"
          :reducer="reducer"
          :data="toc"
          @filter-data="filterData"
        />
        <Icon
          @click.native="navigateToRootTOC"
          class="icon root-toc"
          :class="{ 'toc-disabled': showingRootToc }"
          name="home"
        />
        <span @click.prevent="toggleURNs">
          <Icon class="icon urn" name="eye" v-if="!showURNs" />
          <Icon class="icon urn" name="eye-slash" v-else />
        </span>
      </div>
      <TOC
        :toc="filtered || toc"
        :context="context"
        :passage="passage"
        :showURNs="showURNs"
      />
    </div>
  </div>
</template>

<script>
  import gql from 'graphql-tag';

  import {
    EmptyMessage,
    Icon,
    LoaderBall,
    Lookahead,
  } from '@scaife-viewer/common';
  import { MODULE_NS } from '@scaife-viewer/store';

  import TOC from './TOC.vue';
  import reducers from './reducers';

  const SHOW_RELEVANT_ONLY = true;

  export default {
    name: 'TOCWidget',
    components: {
      EmptyMessage,
      Icon,
      Lookahead,
      LoaderBall,
      TOC,
    },
    scaifeConfig: {
      displayName: 'Table of Contents',
    },
    data() {
      return {
        filtered: null,
        showURNs: false,
      };
    },
    watch: {
      toc: {
        handler(value) {
          this.filtered = value;
        },
      },
    },
    computed: {
      passageWork() {
        // FIXME: Fix this so we have "upTo" in URN module
        if (this.passage) {
          const [tgPart, workPart, ] = `${this.passage}`
            .split(`${this.passage.nss}:`)[1]
            .split(':')[0]
            .split('.');
          return `urn:cts:${this.passage.nss}:${tgPart}.${workPart}:`;
        }
        return '';
      },
      emptyMessage() {
        return SHOW_RELEVANT_ONLY
          ? 'No relevant tables of contents found'
          : 'No tables of contents found';
      },
      toc() {
        if (
          this.showingRootToc &&
          this.relevantEntries &&
          this.relevantEntries.length > 0
        ) {
          // NOTE: Show the root entries
          return {
            label: '',
            items: this.relevantEntries ? this.relevantEntries : [],
          };
        }
        if (
          this.showingRootToc &&
          this.rootEntries &&
          this.rootEntries.length > 0
        ) {
          // NOTE: Show the root entries
          return {
            label: '',
            items: this.rootEntries ? this.rootEntries : [],
          };
        }
        if (this.currentToc && this.tocEntries && this.tocEntries.length > 0) {
          const firstEntry = this.tocEntries[0];
          if (firstEntry.tree) {
            const tree = firstEntry.tree[0];
            return {
              description: firstEntry.description,
              items: tree.children.map(child => child.data),
              label: firstEntry.label,
            };
          }
        }
        // NOTE: Should be unreachable
        return null;
      },
      context() {
        return this.$route.name;
      },
      placeholder() {
        return 'Filter this table of contents...';
      },
      passage() {
        return this.$store.getters[`${MODULE_NS}/passage`];
      },
      metadata() {
        return this.$store.getters[`${MODULE_NS}/metadata`];
      },
      reducer() {
        return reducers.tocReducer;
      },
      returnToRootPayload() {
        return this.context === 'tocs'
          ? { path: 'tocs' }
          : { name: 'reader', params: { urn: `${this.passage}` } };
      },
      showingRootToc() {
        if (this.context === 'tocs') {
          return !this.$route.params.urn;
        }
        // TODO: Simplify this with either the explicit
        // URN or a top-level query
        return !this.$route.query.toc;
      },
      // TODO: Distinguish between "root" and "default" in the UX
      defaultTocUrn() {
        return this.metadata && this.metadata.defaultTocUrn
          ? this.metadata.defaultTocUrn
          : null;
      },
      // TODO: Simplify this with either the explicit
      // URN or a top-level query
      currentToc() {
        return this.$route.query.toc ? this.$route.query.toc : null;
      },
    },
    apollo: {
      relevantEntries: {
        query: gql`
          query($work: String!) {
            tocEntries(depth: 1, work: $work) {
              edges {
                node {
                  label
                  uri
                  urn
                }
              }
            }
          }
        `,
        skip() {
          return !this.passage;
        },
        update(data) {
          return data.tocEntries.edges.map(e => e.node);
        },
        variables() {
          return { work: this.passageWork };
        },
      },
      rootEntries: {
        query: gql`
          query {
            tocEntries(depth: 1) {
              edges {
                node {
                  label
                  uri
                  urn
                }
              }
            }
          }
        `,
        skip() {
          if (SHOW_RELEVANT_ONLY) {
            return true;
          }
          return !!this.$route.query.toc;
        },
        update(data) {
          return data.tocEntries.edges.map(e => e.node);
        },
      },
      tocEntries: {
        query: gql`
          query($urn: String!) {
            tocEntries(urn: $urn) {
              edges {
                node {
                  label
                  description
                  uri
                  urn
                  tree
                }
              }
            }
          }
        `,
        variables() {
          return {
            urn: this.$route.query.toc,
          };
        },
        update(data) {
          return data.tocEntries.edges.map(e => e.node);
        },
        skip() {
          return !this.$route.query.toc;
        },
      },
    },
    methods: {
      navigateToRootTOC() {
        if (this.showingRootToc) {
          return;
        }
        this.$router.push(this.returnToRootPayload);
      },
      toggleURNs() {
        this.showURNs = !this.showURNs;
      },
      filterData(data) {
        this.filtered = data;
      },
    },
  };
</script>

<style lang="scss" scoped>
  div.toc-widget {
    &.with-entries {
      margin: 10px;
      width: calc(100% - 20px);
      flex-direction: column;
      justify-content: flex-start;
    }
  }
  .lookahead-container {
    align-items: center;
    margin-bottom: 0.66em;
    display: flex;
    .form-group {
      flex-basis: 66.66%;
      margin-inline-end: 1em;
    }
  }
  .icon {
    color: var(--sv-widget-toc-icon-text-color, black);
    flex-basis: 16.66%;
    &.urn,
    &.root-toc {
      cursor: pointer;
    }
    &.toc-disabled {
      color: grey;
      cursor: unset;
    }
  }
</style>
