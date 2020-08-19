<template>
  <div class="scholia">
    <EmptyMessage v-if="!lines || lines.length === 0" />
    <div v-for="line in lines" :key="line.idx" class="line">
      <span class="lemma">{{ line.lemma }} </span>
      <span class="comment">{{ line.comment }}</span>
    </div>
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

  export default {
    scaifeConfig: {
      displayName: 'Scholia',
      location: 'sidebar',
      singleton: true,
    },
    components: { Attribution, EmptyMessage },
    computed: {
      urn() {
        return this.$store.getters[`${MODULE_NS}/urn`];
      },
    },
    apollo: {
      lines: {
        query: gql`
          query Scholia($urn: String!) {
            textAnnotations(reference: $urn) {
              edges {
                node {
                  id
                  idx
                  data
                }
              }
            }
          }
        `,
        variables() {
          return { urn: this.urn.absolute };
        },
        update(data) {
          return data.textAnnotations.edges.map(e => {
            return {
              idx: e.node.idx,
              dse: e.node.data.dse,
              comment: e.node.data.comment,
              lemma: e.node.data.lemma,
              references: e.node.data.references,
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

<style lang="scss" scoped>
  .line {
    font-family: var(--sv-widget-scholia-line-font-family, 'Noto Serif');
    font-size: 14px;
    .lemma {
      font-weight: 700;
    }
    margin-bottom: 10px;
  }
</style>
