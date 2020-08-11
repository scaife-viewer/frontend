<template>
  <article class="u-flex" :class="{ 'full-height': fullHeight }">
    <section class="reader-left">
      <h2 v-if="passageTitle" class="reader-heading main-widget-heading">
        {{ passageTitle }}
      </h2>
      <ApolloQuery
        class="reader-container"
        :query="query"
        :variables="queryVariables"
        :update="queryUpdate"
        :skip="urn === null"
      >
        <template v-slot="{ result: { data } }">
          <Paginator :urn="data && data.previous" direction="left" />

          <component
            :is="readerComponent"
            :query-variables="queryVariables"
          />

          <Paginator :urn="data && data.next" direction="right" />
        </template>
      </ApolloQuery>
    </section>
  </article>
</template>

<script>
  import gql from 'graphql-tag';
  import { ApolloQuery } from 'vue-apollo';

  import URN, { Paginator } from '@scaife-viewer/common';
  import { MODULE_NS, SET_PASSAGE, UPDATE_METADATA } from '@scaife-viewer/store';

  export default {
    components: {
      ApolloQuery,
      Paginator,
    },
    scaifeConfig: {},
    methods: {
      setVersionMetadata() {
        if (this.urn === null) {
          return;
        }
        this.$store.dispatch(
          `${MODULE_NS}/${UPDATE_METADATA}`,
          { urn: this.urn.version },
          { root: true },
        );
      },
      queryUpdate(data) {
        const {
          metadata: { next, previous },
        } = data.passageTextParts;
        return {
          next: next ? new URN(next) : null,
          previous: previous ? new URN(previous) : null,
        };
      },
    },
    watch: {
      urn: {
        immediate: true,
        handler() {
          this.$nextTick(() => {
            this.$parent.$el.scrollTop = 0;
          });
          if (this.urn) {
            this.$store.dispatch(
              `${MODULE_NS}/${SET_PASSAGE}`,
              { urn: this.urn.toString() },
              { root: true },
            );
          }
        },
      },
      versionMetadata: {
        immediate: true,
        handler() {
          if (!this.versionMetadata && this.urn) {
            this.setVersionMetadata();
          }
        },
      },
    },
    beforeUpdate() {
      if (this.urn && !this.$route.query.urn) {
        this.$router.push({
          to: 'reader',
          query: {
            urn: this.urn.toString(),
          },
        });
      }
      if (this.urn && this.version !== this.urn.version) {
        this.setVersionMetadata();
      }
    },
    computed: {
      readerComponent() {
        const { displayMode } = this.$store.state[MODULE_NS];
        return this.$scaife.config.readerComponents[displayMode];
      },
      query() {
        return gql`
          query TextParts($urn: String!) {
            passageTextParts(reference: $urn) {
              metadata
            }
            textAlignmentChunks(reference: $urn) {
              edges {
                node {
                  items
                }
              }
            }
          }
        `;
      },
      queryVariables() {
        return { urn: this.urn === null ? '' : this.urn.absolute };
      },
      namedEntitiesMode() {
        return this.$store.getters[`${MODULE_NS}/namedEntitiesMode`];
      },
      urn() {
        return this.$store.getters[`${MODULE_NS}/urn`];
      },
      version() {
        return this.$store.getters[`${MODULE_NS}/firstPassageUrn`].version;
      },
      workTitle() {
        return this.$store.getters[`${MODULE_NS}/workTitle`];
      },
      versionMetadata() {
        return this.$store.state[MODULE_NS].metadata;
      },
      passageTitle() {
        return this.versionMetadata ? this.versionMetadata.label : null;
      },
      fullHeight() {
        return this.namedEntitiesMode;
      },
    },
  };
</script>

<style lang="scss" scoped>
  article {
    width: 100%;
  }
  section {
    width: 100%;
  }
  .full-height {
    height: 100vh;
    overflow: hidden;
  }
  .reader-heading {
    flex: 1;
  }
  .reader-container {
    display: flex;
    align-items: baseline;
    justify-content: left;
    & nav:last-child {
      margin-left: auto;
    }
    ::v-deep .ball-pulse {
      margin-left: auto;
      padding-top: 40px;
    }
  }
</style>
