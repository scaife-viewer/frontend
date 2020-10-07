<template>
  <ApolloQuery
    class="token-alignments-mode-reader"
    :query="query"
    :variables="variables"
    :update="queryUpdate"
    :skip="skipLoading"
  >
    <template v-slot="{ result: { error, data }, isLoading }">
      <EmptyMessage
        v-if="textAlignments && textAlignments.length === 0"
        class="empty-annotations"
      />
      <LoaderBall v-else-if="isLoading || selectedAlignment === null" />
      <ErrorMessage v-else-if="error">
        There was an error loading the requested data.
      </ErrorMessage>
      <EmptyMessage
        v-else-if="Object.keys(data.tokenMap).length === 0"
        class="empty-annotations"
      />
      <template v-else>
        <CustomSelect v-model="selectedAlignment" :options="textAlignments" />
        <component :is="alignmentsComponent" :data="data" :textSize="textSize" :textWidth="textWidth" />
      </template>
    </template>
  </ApolloQuery>
</template>

<script>
  import gql from 'graphql-tag';
  import {
    CustomSelect,
    LoaderBall,
    ErrorMessage,
    EmptyMessage,
  } from '@scaife-viewer/common';
  import { MODULE_NS } from '@scaife-viewer/store';

  import AlignmentSelector from './AlignmentSelector.vue';
  import TextPartTokenAlignments from './TextPartTokenAlignments.vue';
  import RecordTokenAlignment from './RecordTokenAlignments.vue';

  const DEFAULT_ALIGNMENT_MODE = 'urn:cite2:scaife-viewer:alignment.v1:iliad-word-alignment';
  const ALIGNMENT_COMPONENTS = {
    [DEFAULT_ALIGNMENT_MODE]: TextPartTokenAlignments,
    'urn:cite2:scaife-viewer:alignment.v1:iliad-sentence-alignment': RecordTokenAlignment
  };

  export default {
    readerConfig: {
      label: 'Alignments',
      layout: 'wide',
    },
    props: {
      queryVariables: Object,
    },
    components: {
      AlignmentSelector,
      CustomSelect,
      LoaderBall,
      ErrorMessage,
      EmptyMessage,
    },
    watch: {
      textAlignments: {
        handler() {
          if (this.selectedAlignment === null) {
            this.selectedAlignment = this.textAlignments[0];
          }
        },
      },
    },
    apollo: {
      textAlignments: {
        query: gql`query TextAlignments($urn: String!) {
          textAlignments(reference: $urn) {
            edges {
              node {
                id
                label
                urn
              }
            }
          }
        }`,
        variables() {
          return this.queryVariables;
        },
        update(data) {
          return data.textAlignments.edges.map(e => {
            return {
              value: e.node.urn,
              title: e.node.label,
            };
          });
        }
      }
    },
    computed: {
      selectedAlignment: {
        get() {
          if (this.textAlignments === undefined || this.textAlignments.length === 0) {
            return null;
          }
          const id = this.$route.query.rs || DEFAULT_ALIGNMENT_MODE;
          return this.textAlignments.filter(a => a.value === id)[0] || this.textAlignments[0];
        },
        set(value) {
          if (value === undefined) {
            return;
          }
          const query = {
            ...this.$route.query,
            rs: value.value,
          };
          this.$router.replace({ query });
        },
      },
      alignmentsComponent() {
        return ALIGNMENT_COMPONENTS[this.selectedAlignment.value];
      },
      textSize() {
        return this.$store.state[MODULE_NS].readerTextSize;
      },
      textWidth() {
        return this.$store.state[MODULE_NS].readerTextWidth;
      },
      skipLoading() {
        return this.selectedAlignment === null;
      },
      variables() {
        return {
          ...this.queryVariables,
          alignmentUrn: this.selectedAlignment && this.selectedAlignment.value,
        }
      },
      query() {
        return gql`
          query TextParts($urn: String!, $alignmentUrn: ID) {
            textAlignmentRecords(reference: $urn, alignment_Urn: $alignmentUrn) {
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
                              value,
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
      flattenRecords(recordEdges) {
        const recordNodes = recordEdges.map(e => e.node);
        return recordNodes.map(node => {
          return {
            id: node.id,
            relations: node.relations.edges.map(e => {
              return {
                id: e.id,
                tokens: e.node.tokens.edges.map(t => t.node)
              }
            })
          }
        });
      },
      queryUpdate(data) {
        const tokenAlignmentRecords = data.textAlignmentRecords.edges
          .map(e => e.node.relations.edges
            .map(e2 => e2.node.tokens.edges
              .map(e3 => ({token: e3.node.id, record: e.node.id}))
              .flat())
            .flat())
          .flat();

        const recordMap = data.textAlignmentRecords.edges
          .reduce((map, e) => {
            map[e.node.id] = e.node.relations.edges
              .map(e2 => e2.node.tokens.edges
                .map(e3 => e3.node.id))
              .flat();
            return map;
          }, {});

        const tokenMap = tokenAlignmentRecords
          .reduce((map, tokenRecord) => {
            if (map[tokenRecord.token] === undefined) {
              map[tokenRecord.token] = [];
            }
            map[tokenRecord.token].push(tokenRecord.record);
            return map;
          }, {});

        const alignmentRecords = this.flattenRecords(data.textAlignmentRecords.edges);

        return {
          recordMap,
          tokenMap,
          alignmentRecords,
          references: data.textAlignmentRecords.metadata.passageReferences,
        };
      },
    },
  };
</script>

<style lang="scss" scoped>
  .token-alignments-mode-reader {
    flex: 1;
  }
  .empty-annotations {
    text-align: center;
    margin-top: 1rem;
  }
</style>
