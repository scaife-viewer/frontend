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
        v-else-if="Object.keys(data.tokenMap).length === 0"
        class="empty-annotations"
      />
      <template v-else>
        <AlignmentSelector
          :alignments="data.alignments"
          v-model="selectedAlignment"
        />
        <TextAlignments
          :references="data.references"
          :recordMap="data.recordMap"
          :tokenMap="data.tokenMap"
          :textSize="textSize"
          :textWidth="textWidth"
        />
      </template>
    </template>
  </ApolloQuery>
</template>

<script>
  import gql from 'graphql-tag';
  import { LoaderBall, ErrorMessage, EmptyMessage } from '@scaife-viewer/common';
  import { MODULE_NS } from '@scaife-viewer/store';

  import AlignmentSelector from './AlignmentSelector.vue';
  import TextAlignments from './TextAlignments.vue';

  export default {
    readerConfig: {
      label: 'Token Alignments',
      layout: 'wide',
    },
    props: {
      queryVariables: Object,
    },
    components: {
      AlignmentSelector,
      TextAlignments,
      LoaderBall,
      ErrorMessage,
      EmptyMessage,
    },
    data() {
      return {
        selectedAlignment: 'iliad-word-alignment',
      };
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
          alignmentSlug: this.selectedAlignment,
        }
      },
      query() {
        return gql`
          query TextParts($urn: String!, $alignmentSlug: ID) {
            textAlignments(reference: $urn) {
              edges {
                node {
                  name
                  slug
                  id
                }
              }
            }
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
        const tokenAlignmentRecords = data.textAlignmentChunks.edges
          .map(e => e.node.relations.edges
            .map(e2 => e2.node.tokens.edges
              .map(e3 => ({token: e3.node.id, record: e.node.id}))
              .flat())
            .flat())
          .flat();

        const recordMap = data.textAlignmentChunks.edges
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

        const alignments = data.textAlignments.edges.map(e => e.node);

        return {
          recordMap,
          tokenMap,
          alignments,
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
