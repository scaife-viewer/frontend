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
          <div
            class="image-folio"
            v-for="image in data.images"
            :key="image.imageIdentifier"
          >
            <Reader :textParts="image.lines" />
            <ImageViewer
              :imageIdentifier="image.url"
              :reference="image.refs[0]"
              :roi="data.roi"
            />
          </div>
          <EmptyMessage
            class="reader-empty-annotations"
            v-if="data.images === undefined || data.images.length === 0"
          />
        </div>
        <Reader v-else-if="showImage === 'text'" :textParts="data.lines" />
        <template v-else-if="showImage === 'image'">
          <div class="error" v-if="data.images.length > 1">
            <strong>WARNING:</strong> Multiple images are being shown; for best
            results, paginate an image at a time (e.g. view "{{
              data.images.slice(0, 1)[0].refs.slice(0, 1)[0]
            }}")
          </div>
          <div class="image-only-mode-container">
            <div
              class="image-folio"
              v-for="image in data.images"
              :key="image.imageIdentifier"
            >
              <ImageViewer :imageIdentifier="image.url" :roi="data.roi" />
            </div>
          </div>
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
  import {
    LoaderBall,
    ErrorMessage,
    EmptyMessage,
  } from '@scaife-viewer/common';
  import { LAYOUT_WIDTH_WIDE } from '@scaife-viewer/store';

  import ImageViewer from './ImageViewer.vue';
  import ImageViewerToolbar from './ImageViewerToolbar.vue';
  import { IMAGE_VIEWER_STATE_BOTH } from './constants';

  export default {
    readerConfig: {
      label: 'Folio Images',
      layout: LAYOUT_WIDTH_WIDE,
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
        // FIXME: textAnnotations from roi is not efficient;
        // it would be better to mimic the query in widget-scholia
        return gql`
          query Folios($urn: String!) {
            passageTextParts(reference: $urn) {
              edges {
                node {
                  id
                  kind
                  urn
                  ref
                  roi {
                    data
                    coordinatesValue
                    textAnnotations {
                      edges {
                        node {
                          urn
                        }
                      }
                    }
                  }
                  tokens {
                    edges {
                      node {
                        id
                        veRef
                        value
                        spaceAfter
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
                        idx
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
          const { id, kind, ref, roi } = line.node;
          const tokens = line.node.tokens.edges.map(edge => {
            const { value, veRef, spaceAfter } = edge.node;
            return { value, veRef, spaceAfter };
          });
          return { id, kind, ref, roi, tokens };
        });
        const linesMap = lines.reduce(
          (map, line) => ({
            ...map,
            [line.ref]: line,
          }),
          {},
        );
        const roi = lines.map(line => ({ ref: line.ref, roi: line.roi }));
        // FIXME: Ensure relations are ordered on the server
        const images = data.imageAnnotations.edges.map(image => {
          const textParts = image.node.textParts.edges
            .map(e => e.node)
            .sort((a, b) => a.idx - b.idx);
          const refs = textParts.map(textPart => textPart.ref);
          const refLines = refs
            .map(r => linesMap[r])
            .filter(line => line !== undefined);
          return {
            url: image.node.imageIdentifier,
            refs,
            lines: refLines,
          };
        });
        return {
          lines,
          images,
          imageIdentifier: data.imageAnnotations.edges.length
            ? data.imageAnnotations.edges[0].node.imageIdentifier
            : null,
          roi,
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
    }
    &.text,
    &.image {
      .image-only-mode-container {
        > .image-folio {
          display: flex;
        }
      }
    }
    .image-mode-container,
    .image-mode-container .image-folio {
      display: grid;
      &::v-deep .reader {
        overflow: auto;
      }
    }
  }
  .error {
    color: var(--sv-image-mode-reader-error-text-color, #b45141);
    border: 1px solid #d9a8a0;
    border-color: var(--sv-image-mode-reader-error-border-color);
    padding: 0.5rem 0.75rem;
    font-size: 80%;
  }
</style>
