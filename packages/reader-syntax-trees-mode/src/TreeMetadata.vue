<template>
  <div class="tree-metadata">
    <Attributions :version-urn="tree.urn" />
    <template>
      <LoaderBall v-if="$apollo.queries.collection.loading" />
      <div v-else-if="source" class="source-metadata-row">
        <div class="label">Source</div>
        <div class="value">
          <a :href="source.url" target="_blank">
            {{ source.title }}
          </a>
        </div>
      </div>
      <EmptyMessage v-else>
        No metadata found.
      </EmptyMessage>
    </template>
  </div>
</template>

<script>
  import gql from 'graphql-tag';

  import { LoaderBall, EmptyMessage } from '@scaife-viewer/common';

  // TODO: Factor out attributions data model and components
  // FIXME: Remove attributions as dependency
  // eslint-disable-next-line max-len
  import Attributions from '@scaife-viewer/widget-attributions/src/Attributions.vue';

  export default {
    name: 'TreeMetadata',
    props: ['tree'],
    components: {
      Attributions,
      EmptyMessage,
      LoaderBall,
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
          return this.tree.collectionId == null;
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  .tree-metadata {
    margin-top: 5px;
    padding: 5px 10px;
    background-color: var(
      --sv-reader-syntax-trees-mode-tree-metadata-background-color,
      #f6f4f6
    );
    flex-direction: column;
    > * {
      font-size: 14px;
    }
    .source-metadata-row {
      > .label {
        color: var(
          --sv-reader-syntax-trees-mode-tree-metadata-source-label-text-color,
          #868e96
        );
      }
      > .value {
        margin: 0.5em;
        font-family: var(
          --sv-reader-syntax-trees-mode-tree-metadata-source-value-font-family,
          'Noto Serif'
        );
      }
      flex-flow: row nowrap;
      margin: 0.75em 0;
    }
  }
</style>
