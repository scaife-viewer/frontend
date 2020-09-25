<template>
  <ApolloQuery
    class="default-mode-reader"
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
        <Reader :lines="data.lines" />
      </template>
    </template>
  </ApolloQuery>
</template>

<script>
  import gql from 'graphql-tag';
  import { ApolloQuery } from 'vue-apollo';
  import { LoaderBall, EmptyMessage, ErrorMessage } from '@scaife-viewer/common';

  import Reader from './Reader.vue';

  export default {
    readerConfig: {
      label: 'Default',
    },
    components: { ApolloQuery, LoaderBall, EmptyMessage, ErrorMessage, Reader },
    props: {
      queryVariables: Object
    },
    computed: {
      query() {
        return gql`
          query Lines($urn: String!) {
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
                        lemma
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
        const lines = data.passageTextParts.edges.map(line => {
          const { id, ref } = line.node;
          const tokens = line.node.tokens.edges.map(edge => {
            const { value, veRef, lemma } = edge.node;
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
        return { lines };
      },
    },
  };
</script>

<style lang="scss" scoped>
  .default-mode-reader {
    flex: 1;
  }
  .text {
    font-family: var(--widget-reader-text-font-family, 'Noto Serif');
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
