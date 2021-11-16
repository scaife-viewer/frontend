<template>
  <div class="named-entities" :key="urn.absolute">
    <LoaderBall v-if="$apollo.queries.entities.loading" />
    <EmptyMessage v-else-if="entities.length === 0" />
    <template v-else>
      <Lookahead
        placeholder="Filter named entities"
        :reducer="lookaheadReducer"
        :data="entities"
        @filter-data="onFilter"
      />
      <NamedEntity
        v-for="entity in filteredEntities"
        :key="entity.id"
        :entity="entity"
        :selected-entities="selectedEntities"
        @select="onSelect"
      />
      <Attribution v-if="showKempAttribution">
        <a
          href="https://medium.com/pelagios/beyond-translation-building-better-greek-scholars-561ab331a1bc"
          target="_blank"
        >
          Annotated by Josh Kemp
        </a>
      </Attribution>
    </template>
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import {
    Attribution,
    Lookahead,
    LoaderBall,
    EmptyMessage,
  } from '@scaife-viewer/common';
  import {
    MODULE_NS,
    SELECT_NAMED_ENTITIES,
    CLEAR_NAMED_ENTITIES,
  } from '@scaife-viewer/store';

  import NamedEntity from './NamedEntity.vue';

  export default {
    scaifeConfig: {
      displayName: 'Named Entities',
    },
    data() {
      return {
        entities: [],
        filteredEntities: [],
      };
    },
    components: {
      Attribution,
      Lookahead,
      LoaderBall,
      EmptyMessage,
      NamedEntity,
    },
    methods: {
      onSelect(entity) {
        if (this.selectedEntities.filter(id => entity.id === id).length > 0) {
          this.$store.dispatch(`${MODULE_NS}/${CLEAR_NAMED_ENTITIES}`);
        } else {
          this.$store.dispatch(`${MODULE_NS}/${SELECT_NAMED_ENTITIES}`, {
            entities: [entity.id],
          });
        }
      },
      onFilter(data) {
        this.filteredEntities = data;
      },
      lookaheadReducer(data, query) {
        return data.filter(entity =>
          entity.title.toLowerCase().includes(query.toLowerCase()),
        );
      },
    },
    watch: {
      entities: {
        immediate: true,
        handler() {
          this.filteredEntities = this.entities;
        },
      },
    },
    computed: {
      urn() {
        return this.$store.getters[`${MODULE_NS}/urn`];
      },
      selectedEntities() {
        return this.$store.state[MODULE_NS].selectedNamedEntities;
      },
      selectedToken() {
        return this.$store.state[MODULE_NS].selectedToken;
      },
      showKempAttribution() {
        // FIXME: Refactor to load attribution from the
        // namedEntityCollection metadata
        const odysseyUrnPrefix =
          'urn:cite2:beyond-translation:named_entity_collection.atlas_v1:od_';
        return (
          this.entities.length > 0 &&
          this.entities[0].collection.urn.startsWith(odysseyUrnPrefix)
        );
      },
    },
    apollo: {
      entities: {
        query: gql`
          query NamedEntities($urn: String!) {
            namedEntities(reference: $urn) {
              edges {
                node {
                  id
                  title
                  description
                  url
                  kind
                  data
                  collection {
                    urn
                  }
                }
              }
            }
          }
        `,
        variables() {
          return { urn: this.urn.absolute };
        },
        update(data) {
          return data.namedEntities.edges.map(e => e.node);
        },
        skip() {
          return this.urn === null;
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  .named-entities {
    margin: 0 2rem;
    font-size: 12px;
    width: calc(100% - 4rem);
  }
</style>
