<template>
  <div class="scholia" :key="urn.absolute">
    <Legend />
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
  import Legend from './Legend.vue';

  export default {
    scaifeConfig: {
      displayName: 'Scholia',
      location: 'sidebar',
      singleton: true,
    },
    components: { Attribution, Legend, EmptyMessage, Scholion },
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
            textAnnotations(
              reference: $urn,
              collection_Urn: $collectionUrn,
              kind: "scholia"
            ) {
              edges {
                node {
                  id
                  idx
                  data
                  urn
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
          return data.textAnnotations.edges.map(e => {
            // FIXME: This should be simplified
            const roi = e.node.roi.map(roiObj => {
              return {
                ...roiObj,
                textAnnotations: {
                  edges: [
                    {
                      node: e.node,
                    },
                  ],
                },
              };
            });
            return {
              urn: e.node.urn,
              idx: e.node.idx,
              dse: e.node.data.dse,
              comment: e.node.data.comment,
              lemma: e.node.data.lemma,
              references: e.node.data.references,
              roi,
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
