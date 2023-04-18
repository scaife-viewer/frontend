<template>
  <div class="alignment-metadata">
    <Attributions :version-urn="alignment.value" />
    <!-- TODO: Show source information? -->
  </div>
</template>

<script>
  import gql from 'graphql-tag';

  // TODO: Factor out attributions data model and components
  // FIXME: Remove attributions as dependency
  // TODO: Refactor with TreeMetadata
  // eslint-disable-next-line max-len
  import Attributions from '@scaife-viewer/widget-attributions/src/Attributions.vue';

  export default {
    name: 'AlignmentsMetadata',
    props: ['alignment'],
    components: {
      Attributions,
    },
    computed: {
      source() {
        return this.collection ? this.collection.data.source : null;
      },
    },
    apollo: {
      collection: {
        query: gql`
          query TextAnnotationCollection($collectionId: ID!) {
            textAnnotationCollection(id: $collectionId) {
              id
              data
            }
          }
        `,
        variables() {
          return {
            collectionId: this.tree.collectionId,
          };
        },
        update(data) {
          return data.textAnnotationCollection;
        },
        skip() {
          return true;
          // return this.tree.collectionId == null;
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  .alignment-metadata {
    margin-top: 5px;
    padding: 5px 10px;
    background-color: var(
      --sv-reader-alignments-mode-alignments-meta-background-color,
      #f6f4f6
    );
    flex-direction: column;
    > * {
      font-size: 14px;
    }
    .source-metadata-row {
      > .label {
        color: var(
          --sv-reader-alignments-mode-alignments-meta-source-label-text-color,
          #868e96
        );
      }
      > .value {
        margin: 0.5em;
        font-family: var(
          --sv-reader-alignments-mode-alignments-meta-source-value-font-family,
          'Noto Serif'
        );
      }
      flex-flow: row nowrap;
      margin: 0.75em 0;
    }
  }
</style>
