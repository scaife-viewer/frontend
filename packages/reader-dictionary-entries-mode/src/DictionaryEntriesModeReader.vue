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
  import {
    LoaderBall,
    ErrorMessage,
    normalizeString,
  } from '@scaife-viewer/common';
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

        const lemmasCited = new Set(
          data.citedEntries.edges.map(entry => {
            const { headwordNormalized } = entry.node;
            return headwordNormalized;
          }),
        );

        const lemmasResolved = new Set(
          data.resolvedEntries.edges.map(entry => {
            const { headwordNormalized } = entry.node;
            return headwordNormalized;
          }),
        );

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
            let tokenAttrs = {
              value,
              veRef,
            };
            if (lemma) {
              lemmas.push(lemma);
              const normalizedLemma = normalizeString(lemma);
              tokenAttrs = {
                lemma,
                lemmaCited: lemmasCited.has(normalizedLemma),
                lemmaResolved: lemmasResolved.has(normalizedLemma),
                ...tokenAttrs,
              };
            }
            return tokenAttrs;
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
          query textPartsAndEntries($urn: String!) {
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
            citedEntries: dictionaryEntries(reference: $urn) {
              edges {
                node {
                  id
                  headword
                  headwordNormalized
                  urn
                }
              }
            }
            resolvedEntries: dictionaryEntries(
              reference: $urn
              resolveUsingLemmas: true
            ) {
              edges {
                node {
                  id
                  headword
                  headwordNormalized
                  urn
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
</style>
