<template>
  <ApolloQuery
    class="reader"
    :query="query"
    :variables="queryVariables"
    :update="queryUpdate"
  >
    <template v-slot="{ result: { error, data }, isLoading }">
      <LoaderBall v-if="isLoading" />
      <ErrorMessage v-else-if="error">
        There was an error loading the requested data.
      </ErrorMessage>
      <EmptyMessage v-else-if="!data" />
      <template v-else>
        <!-- TODO: Prevent duplicate paint -->
        <div
          :class="{ shown: css, hidden: !css }"
          :key="urn"
          data-tei-fallback="true"
          id="TEI"
        ></div>
        <component :is="'style'" v-if="css" v-html="css" type="text/css" />
      </template>
    </template>
  </ApolloQuery>
</template>

<script>
  import gql from 'graphql-tag';
  import CETEI from 'CETEIcean';
  import { ApolloQuery } from 'vue-apollo';

  import { LAYOUT_WIDTH_WIDE } from '@scaife-viewer/store';

  import {
    LoaderBall,
    ErrorMessage,
    EmptyMessage,
  } from '@scaife-viewer/common';

  const sass = require('sass.js');

  export default {
    readerConfig: {
      label: 'Fallback',
      textWidth: LAYOUT_WIDTH_WIDE,
    },
    components: { ApolloQuery, LoaderBall, ErrorMessage, EmptyMessage },
    props: {
      queryVariables: Object,
    },
    data() {
      return {
        css: null,
        queryUpdateData: null,
      };
    },
    watch: {
      queryUpdateData: {
        handler(newVal) {
          this.initViewer(newVal);
        },
      },
    },
    methods: {
      debugEvent($event) {
        console.log($event);
        console.log(document.getSelection().toString());
      },
      queryUpdate(data) {
        const value = data.passageTextParts.edges[0].node.metadata;
        // TODO: I couldn't figure out how to watch the query directly, so this
        // is a hack
        this.queryUpdateData = value;
        return value;
      },
      initViewer(data) {
        const { css, content } = data;
        // NOTE: v-else on "data" requires us to use nextTick;
        // we could also create the element outside of apollo
        const $vm = this;
        this.$nextTick(() => {
          const CETEIcean = new CETEI();
          CETEIcean.makeHTML5(content, teiData => {
            document.getElementById('TEI').appendChild(teiData);
            // TODO: Allow clicks to drive selection, e.g. the morphology
            // widget.
            // Determine if we want to use mouseup or dblclick
            // document.addEventListener('dblclick', event => {
            //   $vm.debugEvent(event);
            // });
          });
        });

        sass.compile(`[data-tei-fallback]{${css}}`, result => {
          $vm.css = result.text;
        });
      },
    },
    computed: {
      urn() {
        return this.queryVariables.urn;
      },
      query() {
        // TODO: Support querying for CSS from the version in a performant way
        return gql`
          query Fallback($urn: String!) {
            passageTextParts(reference: $urn) {
              edges {
                node {
                  id
                  ref
                  metadata
                }
              }
            }
          }
        `;
      },
    },
  };
</script>

<style lang="scss" scoped>
  div.reader {
    flex: 1;
  }
  // TODO: Revisit text size / width styling from other readers
  .shown {
    display: block;
  }
  .hidden {
    display: none;
  }

  ::v-deep *[data-tei-fallback] {
    @import './CETEIcean.scss';
  }
</style>
