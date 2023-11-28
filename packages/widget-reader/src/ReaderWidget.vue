<template>
  <article :class="{ 'full-height': fullHeight }">
    <section class="reader-left">
      <h2 v-if="passageTitle" class="reader-heading main-widget-heading">
        {{ passageTitle }}
      </h2>
      <ApolloQuery
        class="reader-container"
        :class="[textDirection]"
        :query="query"
        :variables="queryVariables"
        :update="queryUpdate"
        :skip="urn === null"
      >
        <template v-slot="{ result: { data } }">
          <Paginator
            v-if="showPagination"
            :urn="data && data.previous"
            :direction="pagerPrevious"
          />

          <component :is="readerComponent" :query-variables="queryVariables" />

          <Paginator
            v-if="showPagination"
            :urn="data && data.next"
            :direction="pagerNext"
          />
        </template>
      </ApolloQuery>
    </section>
  </article>
</template>

<script>
  import gql from 'graphql-tag';
  import { ApolloQuery } from 'vue-apollo';

  import URN, { Paginator } from '@scaife-viewer/common';
  import {
    MODULE_NS,
    SET_PASSAGE,
    UPDATE_METADATA,
    DISPLAY_MODE_DEFAULT,
  } from '@scaife-viewer/store';

  import PassageLanguageIsRtlMixin from './mixins';

  export default {
    mixins: [PassageLanguageIsRtlMixin],
    components: {
      ApolloQuery,
      Paginator,
    },
    scaifeConfig: {},
    data() {
      return {
        showPagination: true,
      };
    },
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
          nextPassage: next,
          previousPassage: previous,
        } = data.passageTextParts.metadata;
        return {
          next: next ? new URN(next) : null,
          previous: previous ? new URN(previous) : null,
        };
      },
    },
    watch: {
      urn: {
        immediate: true,
        handler(newValue, oldValue) {
          if (newValue) {
            if (oldValue && oldValue.toString() === newValue.toString()) {
              return;
            }
            this.$nextTick(() => {
              this.$parent.$el.scrollTop = 0;
            });

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
      if (this.urn && !this.$route.params.urn) {
        this.$router.push({
          to: 'reader',
          params: {
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
        const displayMode = this.$store.getters[`${MODULE_NS}/displayMode`];
        return this.$scaife.config.readerComponents[displayMode];
      },
      query() {
        return gql`
          query TextParts($urn: String!) {
            passageTextParts(reference: $urn) {
              metadata {
                previousPassage
                nextPassage
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
      versionMetadata() {
        return this.$store.state[MODULE_NS].metadata;
      },
      passageTitle() {
        return this.versionMetadata ? this.versionMetadata.label : null;
      },
      fullHeight() {
        return this.namedEntitiesMode;
      },
      isDefaultDisplayMode() {
        return (
          this.$store.getters[`${MODULE_NS}/displayMode`] ===
          DISPLAY_MODE_DEFAULT
        );
      },
      textDirection() {
        // FIXME: Further localization required across
        // the other display modes
        return this.passageIsRtl && this.isDefaultDisplayMode ? 'rtl' : 'ltr';
      },
      pagerPrevious() {
        return this.textDirection === 'ltr' ? 'left' : 'right';
      },
      pagerNext() {
        return this.textDirection === 'ltr' ? 'right' : 'left';
      },
    },
    mounted() {
      if (this.$route.query.iframe === 'y') {
        this.showPagination = false;
        this.$store.state[MODULE_NS].leftVisible = false;
        this.$store.state[MODULE_NS].rightVisible = false;
      }
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
    height: calc(100vh - 30px);
    overflow: hidden;
  }
  .reader-heading {
    flex: 1;
  }
  .reader-container {
    // TODO: RTLize via .overall from SV1
    display: flex;
    flex-direction: row;
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
  .reader-container.rtl {
    direction: rtl;
  }
</style>
