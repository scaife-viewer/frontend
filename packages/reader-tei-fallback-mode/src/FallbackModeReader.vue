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
        {{ initViewer(data) }}
        <div
          :class="{ shown: css, hidden: !css }"
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

  import { Reader } from '@scaife-viewer/widget-reader';
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
    components: { ApolloQuery, LoaderBall, ErrorMessage, EmptyMessage, Reader },
    props: {
      queryVariables: Object,
    },
    data() {
      return {
        css: null,
      };
    },
    methods: {
      debugEvent($event) {
        console.log(document.getSelection().toString());
      },
      queryUpdate(data) {
        return data.passageTextParts.edges[0].node.metadata;
      },
      initViewer(data) {
        const { css, content } = data;
        // NOTE: v-else on "data" requires us to use nextTick;
        // we could also create the element outside of apollo
        const $vm = this;
        this.$nextTick(() => {
          const CETEIcean = new CETEI();
          CETEIcean.makeHTML5(content, function(teiData) {
            document.getElementById('TEI').appendChild(teiData);
            // TODO: Allow clicks to drive selection, e.g. the morphology
            // widget.
            // Determine if we want to use mouseup or dblclick
            // document.addEventListener('dblclick', event => {
            //   $vm.debugEvent(event);
            // });
          });
        });

        sass.compile(`[data-tei-fallback]{${css}}`, function(result) {
          $vm.css = result.text;
        });
      },
    },
    computed: {
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
