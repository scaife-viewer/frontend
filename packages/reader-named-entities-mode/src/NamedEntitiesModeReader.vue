<template>
  <ApolloQuery
    :class="`entity-mode map-direction-${mapState}`"
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
        <EntityMapToolbar
          v-if="data.coordinatesList.length > 0"
          :mapState="mapState"
          @show="onShowMap"
        />
        <div class="entity-mode-container">
          <Reader class="entity-reader" :lines="data.lines" />
          <div class="map" v-if="showMap && data.coordinatesList.length > 0">
            <SelectableEntityMap
              :key="`${mapState}-${sidebars}`"
              :coordinates-list="data.coordinatesList"
              :selected-entities="selectedEntities"
            />
          </div>
        </div>
      </template>
    </template>
  </ApolloQuery>
</template>

<script>
  import gql from 'graphql-tag';
  import { ApolloQuery } from 'vue-apollo';

  import { Reader } from '@scaife-viewer/widget-reader';
  import { LoaderBall, ErrorMessage, EmptyMessage } from '@scaife-viewer/common';
  import { MODULE_NS } from '@scaife-viewer/store';

  import SelectableEntityMap from './SelectableEntityMap.vue';
  import EntityMapToolbar from './EntityMapToolbar.vue';
  import { MAP_STATE_NONE } from './constants';

  export default {
    readerConfig: {
      label: 'Named Entities',
    },
    props: {
      queryVariables: Object
    },
    components: {
      SelectableEntityMap,
      EntityMapToolbar,
      Reader,
      LoaderBall,
      ErrorMessage,
      EmptyMessage,
      ApolloQuery,
    },
    data() {
      return {
        mapState: MAP_STATE_NONE,
      };
    },
    methods: {
      onShowMap(kind) {
        this.mapState = kind;
      },
      getTokenLookup(entities) {
        const tokenLookup = {};
        entities.forEach(entity => {
          const tokenVeRefs = entity.tokens.edges.map(t => t.node.veRef);
          tokenVeRefs.forEach(veRef => {
            tokenLookup[veRef] = tokenLookup[veRef] || [];
            tokenLookup[veRef].push(entity.id);
          });
        });
        return tokenLookup;
      },
      queryUpdate(data) {
        const entities = data.entities.edges.map(e => e.node);
        const parts = data.textParts.edges;

        const tokenLookup = this.getTokenLookup(entities);
        const lines = parts.map(line => {
          const { id, ref } = line.node;
          const tokens = line.node.tokens.edges.map(edge => {
            const { value, veRef, lemma } = edge.node;
            return {
              value,
              veRef,
              lemma,
              entities: tokenLookup[veRef],
            };
          });
          return {
            id,
            ref,
            tokens,
          };
        });
        const coordinatesList = entities
          .filter(entity => entity.kind === 'PLACE' && entity.data.coordinates)
          .map(entity => {
            return [
              ...entity.data.coordinates
                .split(', ')
                .map(coordinate => parseFloat(coordinate)),
              entity.id,
              entity.title,
            ];
          });
        return {
          lines,
          coordinatesList,
        };
      },
    },
    computed: {
      selectedEntities() {
        return this.$store.state[MODULE_NS].selectedNamedEntities;
      },
      showMap() {
        return this.mapState !== MAP_STATE_NONE;
      },
      sidebars() {
        // used for keys to force map redraw on sidebar changes
        const { leftOpen, rightOpen } = this.$store.state[MODULE_NS];
        if (leftOpen && rightOpen) {
          return 'both';
        }
        if (leftOpen) {
          return 'left';
        }
        if (rightOpen) {
          return 'right';
        }
        return 'neither';
      },
      query() {
        return gql`
          query NamedEntities($urn: String!) {
            textParts: passageTextParts(reference: $urn) {
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
                        lemma
                      }
                    }
                  }
                }
              }
            }
            entities: namedEntities(reference: $urn) {
              edges {
                node {
                  id
                  title
                  kind
                  data
                  tokens {
                    edges {
                      node {
                        id
                        veRef
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
  };
</script>

<style lang="scss" scoped>
  .entity-mode {
    flex: 1;
    &.map-direction-mapStateHorizontal {
      .entity-mode-container {
        grid-template-columns: 1fr 1fr;
        column-gap: 0.75rem;
      }
    }
    &.map-direction-mapStateVertical {
      .entity-mode-container {
        grid-template-rows: 1fr 1fr;
        row-gap: 0.75rem;
      }
    }
    .entity-mode-container {
      display: grid;
      height: calc(100vh - 75px - 3rem);
      .entity-reader {
        overflow-y: scroll;
      }
    }
  }
</style>
