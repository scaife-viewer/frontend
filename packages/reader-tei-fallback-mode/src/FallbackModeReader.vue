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
        {{ initViewer(data) }}
        <div data-tei-fallback="true" id="TEI"></div>
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

  export default {
    readerConfig: {
      label: 'Fallback',
      textWidth: LAYOUT_WIDTH_WIDE,
    },
    components: { ApolloQuery, LoaderBall, ErrorMessage, EmptyMessage, Reader },
    props: {
      queryVariables: Object,
    },
    methods: {
      queryUpdate(data) {
        return data.passageTextParts.edges[0].node.metadata.content;
      },
      initViewer(data) {
        // NOTE: nextTick is required because of the v-else; we may want
        // to revisit this.
        this.$nextTick(() => {
          const CETEIcean = new CETEI();
          CETEIcean.makeHTML5(data, function(teiData) {
            document.getElementById('TEI').appendChild(teiData);
          });
        });
      },
    },
    computed: {
      query() {
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
