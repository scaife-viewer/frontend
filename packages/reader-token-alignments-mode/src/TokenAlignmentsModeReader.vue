<template>
  <ApolloQuery
    class="token-alignments-mode-reader"
    :query="query"
    :variables="variables"
    :update="queryUpdate"
  >
    <template v-slot="{ result: { error, data }, isLoading }">
      <LoaderBall v-if="isLoading" />
      <ErrorMessage v-else-if="error">
        There was an error loading the requested data.
      </ErrorMessage>
      <EmptyMessage
        v-else-if="Object.keys(data.alignmentMap).length === 0"
        class="empty-annotations"
      />
      <Alignments
        v-else
        :references="data.references"
        :alignmentMap="data.alignmentMap"
        :textSize="textSize"
        :textWidth="textWidth"
      />
    </template>
  </ApolloQuery>
</template>

<script>
  import gql from 'graphql-tag';
  import { LoaderBall, ErrorMessage, EmptyMessage } from '@scaife-viewer/common';
  import { MODULE_NS } from '@scaife-viewer/store';

  import Alignments from './Alignments.vue';

  export default {
    readerConfig: {
      label: 'Token Alignments',
      layout: 'wide',
    },
    props: {
      queryVariables: Object,
    },
    components: {
      Alignments,
      LoaderBall,
      ErrorMessage,
      EmptyMessage,
    },
    computed: {
      textSize() {
        return this.$store.state[MODULE_NS].readerTextSize;
      },
      textWidth() {
        return this.$store.state[MODULE_NS].readerTextWidth;
      },
      variables() {
        return {
          ...this.queryVariables,
          urn: 'urn:cts:greekLit:tlg0012.tlg001.perseus-grc2:1.1-1.10', // hard code this for testing
          alignmentSlug: 'iliad-word-alignment',  // hard coded for now
        }
      },
      query() {
        return gql`
          query TextParts($urn: String!, $alignmentSlug: ID) {
            textAlignmentChunks(reference: $urn, alignment_Slug: $alignmentSlug) {
              metadata {
                passageReferences
              }
              edges {
                node {
                  id
                  relations {
                    edges {
                      node {
                        id
                        tokens {
                          edges {
                            node {
                              id
                              veRef
                              wordValue
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
      queryUpdate(data) {
        const alignments = data.textAlignmentChunks.edges
          .map(e => e.node.relations.edges
            .map(e2 => e2.node.tokens.edges
              .map(e3 => e3.node.id)));

        // Create a two-way lookup map
        const alignmentMap = alignments.reduce((map, relation) => {
          const left = relation[0][0];
          const right = relation[1];
          if (map[left] === undefined) {
            map[left] = [];
          }
          map[left].push(right);
          right.forEach(rightId => {
            if (map[rightId] === undefined) {
              map[rightId] = [];
            }
            map[rightId].push(left);
          });
          return map;
        }, {});
        return {
          alignmentMap,
          references: data.textAlignmentChunks.metadata.passageReferences,
        };
      },
    },
  };
</script>

<style lang="scss" scoped>
  .empty-annotations {
    text-align: center;
    margin-top: 1rem;
  }
</style>
