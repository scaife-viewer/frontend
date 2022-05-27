<template>
  <ApolloQuery
    class="commentaries-mode-reader"
    :query="query"
    :variables="queryVariables"
    :update="queryUpdate"
  >
    <template v-slot="{ result: { error, data }, isLoading }">
      <LoaderBall v-if="isLoading" />
      <ErrorMessage v-else-if="error">
        There was an error loading the requested data.
      </ErrorMessage>
      <EmptyMessage v-else-if="data.textParts.length === 0" />
      <template v-else>
        <Reader :textParts="data.textParts" />
      </template>
    </template>
  </ApolloQuery>
</template>

<script>
  import gql from 'graphql-tag';
  import { ApolloQuery } from 'vue-apollo';

  import { Reader } from '@scaife-viewer/widget-reader';
  import {
    LoaderBall,
    EmptyMessage,
    ErrorMessage,
  } from '@scaife-viewer/common';
  import { MODULE_NS } from '@scaife-viewer/store';

  export default {
    readerConfig: {
      label: 'Commentaries',
    },
    props: {
      queryVariables: Object,
    },
    components: {
      Reader,
      EmptyMessage,
      LoaderBall,
      ErrorMessage,
      ApolloQuery,
    },
    // TODO: Re-use from default mode reader
    // FIXME: Get annotations from the reader mode, not the widget?
    // Put another way, it isn't usable without the widget being enabled.
    // Revisit this for dictionary entries mode too.
    computed: {
      query() {
        return gql`
          query Lines($urn: String!) {
            passageTextParts(reference: $urn) {
              edges {
                node {
                  id
                  ref
                  kind
                  tokens {
                    edges {
                      node {
                        id
                        veRef
                        value
                      }
                    }
                  }
                }
              }
            }
          }
        `;
      },
    },
    methods: {
      queryUpdate(data) {
        const textParts = data.passageTextParts.edges.map(textPart => {
          const { id, ref, kind } = textPart.node;
          const tokens = textPart.node.tokens.edges.map(edge => {
            const { value, veRef } = edge.node;
            return {
              value,
              veRef,
            };
          });
          return {
            id,
            ref,
            kind,
            tokens,
          };
        });
        return { textParts };
      },
    },
  };
</script>
