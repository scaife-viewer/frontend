<template>
  <div class="token-alignments-mode-reader">
    <LoaderBall v-if="$apollo.loading" />
    <ErrorMessage v-else-if="errors" />
    <template v-else-if="passageHasAlignments">
      <div class="toolbar">
        <CustomSelect
          v-model="selectedAlignment"
          :options="textAlignments"
          placeholder="Select an alignment..."
        />
        <div v-show="isTextPartAlignment" class="toggle-container">
          <a
            href
            @click.prevent="showEmpty = !showEmpty"
            class="toggle-control"
          >
            {{ !showEmpty ? 'Show ' : 'Hide ' }} unaligned tokens
          </a>
        </div>
      </div>
      <component
        v-if="recordsExistForPassage"
        :is="alignmentsComponent"
        :data="textAlignmentRecords"
        :textSize="textSize"
        :textWidth="textWidth"
        :showEmpty="showEmpty"
      />
      <EmptyMessage
        v-else-if="canSelectAnotherAlignment"
        class="empty-annotations"
      >
        No records found for the currently selected alignment.
      </EmptyMessage>
    </template>
    <EmptyMessage v-else class="empty-annotations" />
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import {
    EmptyMessage,
    ErrorMessage,
    ReaderLink,
    CustomSelect,
  } from '@scaife-viewer/common';
  import { MODULE_NS } from '@scaife-viewer/store';

  import TextPartTokenAlignments from './TextPartTokenAlignments.vue';
  import RecordTokenAlignment from './RecordTokenAlignments.vue';
  import RegroupedAlignmentsPrototype from './RegroupedAlignmentsPrototype.vue';

  export default {
    readerConfig: {
      label: 'Alignments',
      layout: 'wide',
    },
    props: {
      queryVariables: Object,
    },
    data() {
      return {
        errors: false,
        // TODO: Consider vuex
        showEmpty: false,
      };
    },
    components: {
      CustomSelect,
      EmptyMessage,
      ErrorMessage,
      ReaderLink,
    },
    computed: {
      passageHasAlignments() {
        return this.textAlignments && this.textAlignments.length > 0;
      },
      prototypeEnabled() {
        const isHafezAlignment =
          this.alignmentUrn.indexOf(
            'urn:cite2:scaife-viewer:alignment.v1:hafez-farsi',
          ) > -1;
        const isFarsiPrimaryText =
          this.$route.params.urn.indexOf('perseus-far') > -1;
        const isThreeWayAlignment =
          this.alignmentUrn ===
          // eslint-disable-next-line max-len
          'urn:cite2:scaife-viewer:alignment.v1:hafez-farsi-german-farsi-english-word-alignments-temp';
        if (!isHafezAlignment) {
          // Keep Bodin as-is
          return false;
        }
        if (isThreeWayAlignment && !isFarsiPrimaryText) {
          // NOTE: There are currently a lot of "regrouping"
          // issues, so we don't want to show the prototype
          // unless Farsi is the first text.
          return false;
        }
        // NOTE: Otherwise, if this is a Hafez alignment, show the
        // prototype
        return true;
      },
      recordsExistForPassage() {
        return (
          this.textAlignmentRecords &&
          this.textAlignmentRecords.references.length > 0
        );
      },
      canSelectAnotherAlignment() {
        return this.selectedAlignment && this.textAlignments.length > 0;
      },
      alignmentUrn: {
        get() {
          return this.$route.query.rs;
        },
        set(value) {
          if (value === undefined) {
            return;
          }
          const query = {
            ...this.$route.query,
            rs: value,
          };
          this.$router.replace({ query });
        },
      },
      //
      alignmentsComponent() {
        if (this.prototypeEnabled) {
          return RegroupedAlignmentsPrototype;
        }
        const hint = this.textAlignmentRecords.displayHint;
        return hint === 'records'
          ? RecordTokenAlignment
          : TextPartTokenAlignments;
      },
      isTextPartAlignment() {
        return (
          this.recordsExistForPassage &&
          this.alignmentsComponent !== RecordTokenAlignment
        );
      },
      textSize() {
        return this.$store.state[MODULE_NS].readerTextSize;
      },
      textWidth() {
        return this.$store.state[MODULE_NS].readerTextWidth;
      },
    },
    watch: {
      selectedAlignment: {
        handler(value) {
          if (value && value.value !== this.alignmentUrn) {
            this.alignmentUrn = value.value;
          }
        },
      },
      textAlignments: {
        handler() {
          if (this.alignmentUrn === undefined) {
            if (this.textAlignments.length > 0) {
              const value = this.textAlignments[0];
              const query = {
                ...this.$route.query,
                rs: value.value,
              };
              this.$router.replace({ query });
            }
          }
        },
      },
    },
    methods: {
      flattenRecords(recordEdges) {
        const recordNodes = recordEdges.map(e => e.node);
        return recordNodes.map(node => {
          return {
            id: node.id,
            label: node.label,
            relations: node.relations.edges.map(e => {
              return {
                id: e.id,
                tokens: e.node.tokens.edges.map(t => t.node),
              };
            }),
          };
        });
      },
    },
    apollo: {
      selectedAlignment: {
        query: gql`
          query TextAlignments($urn: String!) {
            textAlignments(urn: $urn) {
              edges {
                node {
                  id
                  label
                  urn
                }
              }
            }
          }
        `,
        skip() {
          return !this.alignmentUrn;
        },
        update(data) {
          return data.textAlignments.edges.map(e => {
            return {
              value: e.node.urn,
              title: e.node.label,
            };
          })[0];
        },
        variables() {
          return {
            urn: this.alignmentUrn,
          };
        },
        error() {
          this.errors = true;
        },
      },
      textAlignments: {
        query: gql`
          query TextAlignments($urn: String!) {
            textAlignments(reference: $urn) {
              edges {
                node {
                  id
                  label
                  urn
                }
              }
            }
          }
        `,
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
        },
        error() {
          this.errors = true;
        },
      },
      textAlignmentRecords: {
        variables() {
          return {
            ...this.queryVariables,
            alignmentUrn: this.alignmentUrn,
          };
        },
        query() {
          return gql`
            query TextParts($urn: String!, $alignmentUrn: ID) {
              textAlignmentRecords(
                reference: $urn
                alignment_Urn: $alignmentUrn
              ) {
                metadata {
                  passageReferences
                  displayHint
                }
                edges {
                  node {
                    id
                    label
                    relations {
                      edges {
                        node {
                          id
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
                }
              }
            }
          `;
        },
        skip() {
          return !this.alignmentUrn;
        },
        update(data) {
          const tokenAlignmentRecords = data.textAlignmentRecords.edges
            .map(e =>
              e.node.relations.edges
                .map(e2 =>
                  e2.node.tokens.edges
                    .map(e3 => ({ token: e3.node.id, record: e.node.id }))
                    .flat(),
                )
                .flat(),
            )
            .flat();

          const recordMap = data.textAlignmentRecords.edges.reduce(
            (map, e) => ({
              ...map,
              [e.node.id]: e.node.relations.edges
                .map(e2 => e2.node.tokens.edges.map(e3 => e3.node.id))
                .flat(),
            }),
            {},
          );

          const tokenMap = tokenAlignmentRecords.reduce(
            (map, tokenRecord) => ({
              ...map,
              [tokenRecord.token]: [
                ...(map[tokenRecord.token] || []),
                tokenRecord.record,
              ],
            }),
            {},
          );

          const alignmentRecords = this.flattenRecords(
            data.textAlignmentRecords.edges,
          );

          return {
            recordMap,
            tokenMap,
            alignmentRecords,
            references: data.textAlignmentRecords.metadata.passageReferences,
            displayHint: data.textAlignmentRecords.metadata.displayHint,
          };
        },
        error() {
          this.errors = true;
        },
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
  .toolbar {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 14px;
    margin-bottom: 1em;
  }
  .toggle-container {
    padding-inline-start: 1em;
  }
</style>
