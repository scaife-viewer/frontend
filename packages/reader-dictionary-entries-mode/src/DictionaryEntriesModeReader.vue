<template>
  <ApolloQuery :query="query" :variables="queryVariables" :update="queryUpdate">
    <template v-slot="{ result: { error, data }, isLoading }">
      <LoaderBall v-if="isLoading" />
      <ErrorMessage v-else-if="error">
        There was an error loading the requested data.
      </ErrorMessage>
      <template v-else>
        <div class="dictionary-entries-mode-container">
          <Reader class="dictionary-entries-reader" :textParts="data.lines" />
        </div>
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
      label: 'Dictionary Entries',
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
      getTokenLookup(entities) {
        const tokenLookup = {};
        entities.forEach(entity => {
          const tokenVeRefs = entity.tokens.edges.map(t => t.node.veRef);
          tokenVeRefs.forEach(veRef => {
            tokenLookup[veRef] = tokenLookup[veRef] || [];
            tokenLookup[veRef].push(entity.id);
          });
        });
        return tokenLookup;
      },
      queryUpdate(data) {
        const parts = data.textParts.edges;

        const lemmas = [];
        const lines = parts.map(line => {
          const { id, ref } = line.node;
          const tokens = line.node.tokens.edges.map(edge => {
            const token = edge.node;
            const { value, veRef } = token;

            // TODO: Improve encapsulation of additional annotation data
            const firstAnnotationEdge =
              token.annotations.edges.slice(0, 1)[0] || null;
            const annotationData = firstAnnotationEdge
              ? firstAnnotationEdge.node.data
              : {};

            const { lemma } = annotationData;
            lemmas.push(lemma);

            return {
              value,
              veRef,
              lemma,
            };
          });
          return {
            id,
            ref,
            tokens,
          };
        });
        return {
          lines,
          lemmas,
        };
      },
    },
    computed: {
      selectedEntities() {
        return this.$store.state[MODULE_NS].selectedNamedEntities;
      },
      query() {
        return gql`
          query NamedEntities($urn: String!) {
            textParts: passageTextParts(reference: $urn) {
              edges {
                node {
                  id
                  ref
                  tokens {
                    edges {
                      node {
                        id
                        veRef
                        value
                        annotations(first: 1) {
                          edges {
                            node {
                              collection {
                                urn
                              }
                              data
                            }
                          }
                        }
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

<style lang="scss" scoped></style>
