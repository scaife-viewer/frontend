<template>
  <ApolloQuery
    class="image-mode"
    :class="showImage"
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
        <ImageViewerToolbar :show="showImage" @show="onShowImage" />
        <div class="image-mode-container" v-if="showImage === 'both'">
          <div class="image-folio" v-for="image in data.images" :key="image.imageIdentifier">
            <Reader :lines="image.lines" />
            <ImageViewer :imageIdentifier="image.url" :reference="image.refs[0]" />
          </div>
          <EmptyMessage class="reader-empty-annotations" v-if="data.images === undefined || data.images.length === 0" />
        </div>
        <Reader v-else-if="showImage === 'text'" :lines="data.lines" />
        <template v-else-if="showImage === 'image'">
          <ImageViewer v-for="image in data.images" :key="image.url" :imageIdentifier="image.url" />
        </template>
        <EmptyMessage class="reader-empty-annotations" v-else />
      </template>
    </template>
  </ApolloQuery>
</template>

<script>
  import gql from 'graphql-tag';
  import { ApolloQuery } from 'vue-apollo';

  import { Reader } from '@scaife-viewer/widget-reader';
  import { LoaderBall, ErrorMessage, EmptyMessage } from '@scaife-viewer/common';

  import ImageViewer from './ImageViewer.vue';
  import ImageViewerToolbar from './ImageViewerToolbar.vue';
  import { IMAGE_VIEWER_STATE_BOTH } from './constants';

  export default {
    readerConfig: {
      label: 'Folio Images',
      layout: 'wide',
    },
    props: {
      queryVariables: Object,
    },
    components: {
      ApolloQuery,
      EmptyMessage,
      ErrorMessage,
      LoaderBall,
      ImageViewer,
      ImageViewerToolbar,
      Reader,
    },
    computed: {
      showImage: {
        get() {
          return this.$route.query.rs || IMAGE_VIEWER_STATE_BOTH;
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
      query() {
        return gql`
          query Folios($urn: String!) {
            passageTextParts(reference: $urn) {
              edges {
                node {
                  id
                  kind
                  urn
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
            imageAnnotations(reference: $urn) {
              edges {
                node {
                  id
                  idx
                  imageIdentifier
                  textParts {
                    edges {
                      node {
                        id
                        ref
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
      onShowImage(kind) {
        this.showImage = kind;
      },
      queryUpdate(data) {
        const lines = data.passageTextParts.edges.map(line => {
          const { id, kind, ref } = line.node;
          const tokens = line.node.tokens.edges.map(edge => {
            const { value, veRef, lemma } = edge.node;
            return { value, veRef, lemma };
          });
          return { id, kind, ref, tokens };
        });
        const linesMap = lines.reduce((map, line) => ({
          ...map,
          [line.ref]: line,
        }), {});
        const images = data.imageAnnotations.edges.map(image => {
          const refs = image.node.textParts.edges.map(e => e.node.ref);
          const lines = refs.map(r => linesMap[r]).filter(line => line !== undefined);
          return {
            url: image.node.imageIdentifier,
            refs,
            lines,
          };
        });
        return {
          lines,
          images,
          imageIdentifier: data.imageAnnotations.edges.length
            ? data.imageAnnotations.edges[0].node.imageIdentifier
            : null,
        };
      },
    },
  };
</script>

<style lang="scss" scoped>
  .image-mode {
    flex: 1;
    &.both {
      .image-mode-container {
        display: block;
      }
      .image-mode-container .image-folio {
        display: flex;
        > div {
          flex: 1;
        }
        &::v-deep .open-seadragon {
          height: unset;
          margin-left: 5px;
        }
        margin-bottom: 20px;
      }
      .image-mode-container,
      .image-mode-container .image-folio {
        height: unset;
      }
    }
    &.text,
    &.image {
      .image-mode-container {
        grid-template-columns: 1fr;
      }
    }
    .image-mode-container,
    .image-mode-container .image-folio {
      display: grid;
      height: calc(100vh - 150px);
      &::v-deep .reader {
        overflow: auto;
      }
    }
  }
</style>
