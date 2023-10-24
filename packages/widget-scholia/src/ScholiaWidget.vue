<template>
  <div class="scholia" :key="urn.absolute">
    <EmptyMessage v-if="!lines || lines.length === 0" />
    <Scholion v-for="line in lines" :key="line.idx" :line="line" />
    <Attribution>
      <a href="http://www.homermultitext.org" target="_blank">
        Homer Multitext Project / Center for Hellenic Studies
      </a>
    </Attribution>
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import { Attribution, EmptyMessage } from '@scaife-viewer/common';
  import { MODULE_NS } from '@scaife-viewer/store';
  import Scholion from './Scholion.vue';

  export default {
    scaifeConfig: {
      displayName: 'Scholia',
      location: 'sidebar',
      singleton: true,
    },
    components: { Attribution, EmptyMessage, Scholion },
    data() {
      return {
        scholiaCollectionUrn: this.$scaife.config.scholiaCollectionUrn,
      };
    },
    computed: {
      urn() {
        return this.$store.getters[`${MODULE_NS}/urn`];
      },
    },
    apollo: {
      lines: {
        query: gql`
          query Scholia($urn: String!, $collectionUrn: ID) {
            textAnnotations(reference: $urn, collection_Urn: $collectionUrn) {
              edges {
                node {
                  id
                  idx
                  data
                  roi {
                    coordinatesValue
                  }
                }
              }
            }
          }
        `,
        variables() {
          return {
            urn: this.urn.absolute,
            collectionUrn: this.scholiaCollectionUrn || '',
          };
        },
        update(data) {
          return data.textAnnotations.edges.map((e) => {
            return {
              idx: e.node.idx,
              dse: e.node.data.dse,
              comment: e.node.data.comment,
              lemma: e.node.data.lemma,
              references: e.node.data.references,
              roi: e.node.roi,
            };
          });
        },
        skip() {
          return this.urn === null;
        },
      },
    },
  };
</script>
