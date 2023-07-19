<template>
  <ApolloQuery
    class="grammatical-entries-mode"
    :query="query"
    :variables="queryVariables"
    :update="queryUpdate"
  >
    <template v-slot="{ result: { error, data }, isLoading }">
      <LoaderBall v-if="isLoading" />
      <ErrorMessage v-else-if="error">
        There was an error loading the requested data.
      </ErrorMessage>
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
  import { LoaderBall, ErrorMessage } from '@scaife-viewer/common';
  import { MODULE_NS } from '@scaife-viewer/store';

  export default {
    readerConfig: {
      label: 'Grammatical Entries',
    },
    props: {
      queryVariables: Object,
    },
    components: {
      Reader,
      LoaderBall,
      ErrorMessage,
      ApolloQuery,
    },
    methods: {
      getTokenLookup(entries) {
        const tokenLookup = {};
        entries.forEach(entry => {
          const tokenVeRefs = entry.tokens.edges.map(t => t.node.veRef);
          tokenVeRefs.forEach(veRef => {
            tokenLookup[veRef] = tokenLookup[veRef] || [];
            tokenLookup[veRef].push(entry.id);
          });
        });
        return tokenLookup;
      },
      queryUpdate(data) {
        const entries = data.entries.edges.map(e => e.node);
        const parts = data.textParts.edges;

        const tokenLookup = this.getTokenLookup(entries);
        const textParts = parts.map(textPart => {
          const { id, ref, kind } = textPart.node;
          const tokens = textPart.node.tokens.edges.map(edge => {
            const { value, veRef, spaceAfter } = edge.node;
            return {
              value,
              veRef,
              spaceAfter,
              grammaticalEntries: tokenLookup[veRef],
            };
          });
          return {
            id,
            ref,
            kind,
            tokens,
          };
        });
        return {
          textParts,
        };
      },
    },
    computed: {
      selectedEntries() {
        return this.$store.state[MODULE_NS].selectedGrammaticalEntries;
      },
      // TODO: Refactor with CommentariesModeReader
      query() {
        return gql`
          query GrammaticalEntries($urn: String!) {
            textParts: passageTextParts(reference: $urn) {
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
                        spaceAfter
                      }
                    }
                  }
                }
              }
            }
            entries: grammaticalEntries(reference: $urn) {
              edges {
                node {
                  id
                  label
                  data
                  tokens {
                    edges {
                      node {
                        id
                        veRef
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
  };
</script>
