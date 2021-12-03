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
      <EmptyMessage v-else-if="data.lines.length === 0" />
      <template v-else>
        <Reader :textParts="data.lines" />
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
    EmptyMessage,
  } from '@scaife-viewer/common';

  export default {
    readerConfig: {
      label: 'Interlinear',
    },
    components: { ApolloQuery, LoaderBall, ErrorMessage, EmptyMessage, Reader },
    props: {
      queryVariables: Object,
    },
    computed: {
      // TODO: Improve annotations subquery performance
      // Expose UI to select collection
      query() {
        return gql`
          query Interlinear($urn: String!) {
            passageTextParts(reference: $urn) {
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
    methods: {
      // TODO: Figure out query and fields in the new world
      queryUpdate(data) {
        const lines = data.passageTextParts.edges.map(line => {
          const { id, ref } = line.node;
          const tokens = line.node.tokens.edges.map(edge => {
            const { value, veRef } = edge.node;
            // TODO: Improve encapsulation of additional annotation data
            const firstAnnotationEdge =
              edge.node.annotations.edges.slice(0, 1)[0] || null;
            const annotationData = firstAnnotationEdge
              ? firstAnnotationEdge.node.data
              : {};
            const { lemma, partOfSpeech, tag } = annotationData;
            return {
              value,
              veRef,
              lemma,
              partOfSpeech,
              tag,
            };
          });
          return {
            id,
            ref,
            tokens,
          };
        });
        return { lines };
      },
    },
  };
</script>

<style lang="scss" scoped>
  div.reader {
    flex: 1;
  }
  .text {
    font-family: var(
      --sv-reader-interlinear-mode-text-font-family,
      'Noto Serif'
    );
    margin: 1em 0;

    &.text-xs {
      line-height: 1.5;
    }
    &.text-sm {
      line-height: 1.6;
    }
    &.text-md {
      line-height: 1.7;
    }
    &.text-lg {
      line-height: 1.8;
    }
    &.text-xl {
      line-height: 1.9;
    }
  }

  .widget-sidebar .text {
    font-size: 14px;
    line-height: 1.6;
  }

  .text-xs {
    font-size: 12px;
  }
  .text-sm {
    font-size: 14px;
  }
  .text-md {
    font-size: 16px;
  }
  .text-lg {
    font-size: 20px;
  }
  .text-xl {
    font-size: 24px;
  }

  .metrical-attribution {
    margin-top: 1rem;
    text-align: center;
  }

  // TODO: media queries for defaults?
  .text-width-narrow {
    max-width: 20em;
  }

  .text-width-normal {
    max-width: 30em;
  }

  .text-width-wide {
    max-width: 40em;
  }

  .text-width-full {
    max-width: 100%;
  }
</style>
