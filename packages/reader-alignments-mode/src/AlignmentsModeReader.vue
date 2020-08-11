<template>
  <ApolloQuery
    class="alignments-mode-reader"
    :query="query"
    :variables="queryVariables"
    :update="queryUpdate"
  >
    <template v-slot="{ result: { error, data }, isLoading }">
      <LoaderBall v-if="isLoading" />
      <ErrorMessage v-else-if="error">
        There was an error loading the requested data.
      </ErrorMessage>
      <EmptyMessage
        v-else-if="data.alignments.length === 0"
        class="empty-annotations"
      />
      <Alignments
        v-else
        :alignments="data.alignments"
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
      label: 'Sentence Alignments',
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
      query() {
        return gql`
          query TextParts($urn: String!) {
            textAlignmentChunks(reference: $urn) {
              edges {
                node {
                  items
                }
              }
            }
          }
        `;
      },
    },
    methods: {
      queryUpdate(data) {
        return {
          alignments: data.textAlignmentChunks.edges.map(e => e.node.items),
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
