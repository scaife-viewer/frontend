<template>
  <ApolloQuery
    class="reader"
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
        <InterlinearModeToolbar :availableToggles="availableToggles" />
        <Reader :textParts="data.lines" />
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
    TOKEN_ANNOTATION_TOGGLES,
  } from '@scaife-viewer/common';

  // TODO: Toggle refs on / off
  import {
    SHOW_TRANSLITERATION,
    SHOW_LEMMA,
    SHOW_RELATIONSHIP,
    SHOW_MORPH_TAG,
    SHOW_GRAMMATICAL_TAGS,
    SHOW_GLOSS,
    MODULE_NS,
  } from '@scaife-viewer/store';

  import InterlinearModeToolbar from './InterlinearModeToolbar.vue';

  export default {
    readerConfig: {
      label: 'Interlinear',
      annotationDefaults: {
        [SHOW_TRANSLITERATION]: true,
        [SHOW_LEMMA]: true,
        [SHOW_RELATIONSHIP]: true,
        [SHOW_MORPH_TAG]: true,
        [SHOW_GRAMMATICAL_TAGS]: true,
        [SHOW_GLOSS]: true,
      },
    },
    components: {
      ApolloQuery,
      LoaderBall,
      ErrorMessage,
      EmptyMessage,
      Reader,
      InterlinearModeToolbar,
    },
    props: {
      queryVariables: Object,
    },
    watch: {
      metadata: {
        // FIXME: Finish refactor with DisplayMode toggle
        // 1: Mode matters
        // 2: User state matters
        handler(newValue) {
          if (!newValue) {
            return;
          }
          [...TOKEN_ANNOTATION_TOGGLES].forEach(entry => {
            const [propertyName] = entry;
            let value = false;
            if (this.isAvailable(propertyName)) {
              value = this.$options.readerConfig.annotationDefaults[
                propertyName
              ];
            }
            this.$store.state[MODULE_NS][propertyName] = value;
          });
        },
        immediate: true,
      },
    },
    computed: {
      // TODO: Improve annotations subquery performance
      // Expose UI to select collection
      query() {
        return gql`
          query Interlinear($urn: String!) {
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
                        transliteratedWordValue
                        annotations(first: 1) {
                          edges {
                            node {
                              collection {
                                urn
                              }
                              data
                            }
                          }
                        }
                        grammaticalEntries {
                          edges {
                            node {
                              label
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
      metadata() {
        return this.$store.getters[`${MODULE_NS}/metadata`];
      },
      availableToggles() {
        // TODO: Allow the selected token annotation collection
        // to determine availability
        const toggles = [...TOKEN_ANNOTATION_TOGGLES];
        return toggles.filter(entry => this.isAvailable(entry[0]));
      },
      passage() {
        return this.$store.getters[`${MODULE_NS}/passage`];
      },
    },
    methods: {
      // TODO: Figure out query and fields in the new world
      queryUpdate(data) {
        const lines = data.passageTextParts.edges.map(line => {
          const { id, ref } = line.node;
          const tokens = line.node.tokens.edges.map(tokenEdge => {
            const { value, veRef, transliteratedWordValue } = tokenEdge.node;
            // TODO: Improve encapsulation of additional annotation data
            const firstAnnotationEdge =
              tokenEdge.node.annotations.edges.slice(0, 1)[0] || null;
            const annotationData = firstAnnotationEdge
              ? firstAnnotationEdge.node.data
              : {};
            const { lemma, partOfSpeech, tag } = annotationData;
            const glossEng = annotationData['gloss (eng)'];
            const glossFas = annotationData['gloss (fas)'];
            const grammaticalEntryEdges =
              tokenEdge.node.grammaticalEntries.edges;
            const grammaticalTags = grammaticalEntryEdges.map(geEdge => {
              return geEdge.node.label;
            });
            return {
              value,
              veRef,
              transliteratedWordValue,
              lemma,
              partOfSpeech,
              tag,
              grammaticalTags,
              glossEng,
              glossFas,
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
      // TODO: Factor out to a mixin
      isAvailable(propertyName) {
        if (propertyName === SHOW_TRANSLITERATION) {
          return this.metadata.lang === 'grc';
        }
        if (propertyName === SHOW_GRAMMATICAL_TAGS) {
          return this.passage.textGroup === 'tlg0012';
        }
        if (propertyName === SHOW_RELATIONSHIP) {
          return this.passage.nss === 'greekLit';
        }
        return true;
      },
    },
  };
</script>

<style lang="scss" scoped>
  div.reader {
    flex: 1;
  }
  .text {
    font-family: var(
      --sv-reader-interlinear-mode-text-font-family,
      'Noto Serif'
    );
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
