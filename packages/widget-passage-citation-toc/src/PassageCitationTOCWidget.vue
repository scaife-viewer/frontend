<template v-if="textParts">
  <div class="passage-citation-toc-widget">
    <div class="grid-cell-square" v-for="part in textParts" :key="part.urn">
      <ReaderLink :class="{ 'active-textpart': part.selected }" :urn="part.urn">
        {{ part.lcp }}
      </ReaderLink>
    </div>
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import { ReaderLink } from '@scaife-viewer/common';
  import { MODULE_NS } from '@scaife-viewer/store';

  export default {
    name: 'PassageCitationTOCWidget',
    components: { ReaderLink },
    scaifeConfig: {
      displayName: 'Table of Contents',
    },
    computed: {
      passage() {
        return this.$store.getters[`${MODULE_NS}/passage`];
      },
      textParts() {
        if (this.overviewData === undefined) {
          return [];
        }
        const { selected } = this.overviewData;
        return this.overviewData.all.map(s => {
          return {
            ...s,
            // TODO: we've overloaded URN; might need to think about that
            selected: selected.filter(s2 => s2.idx === s.idx).length > 0,
          };
        });
      },
    },
    apollo: {
      overviewData: {
        query: gql`
          query Overview($urn: String!) {
            passageTextParts(reference: $urn) {
              metadata {
                overview {
                  all
                  selected
                }
              }
            }
          }
        `,
        variables() {
          return { urn: this.passage.absolute };
        },
        update(data) {
          const { all, selected } = data.passageTextParts.metadata.overview;
          return { all, selected };
        },
        skip() {
          return !this.passage;
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  a {
    text-decoration: none;
  }
  .passage-citation-toc-widget {
    width: 100%;
    display: grid;
    grid-auto-rows: 1fr;
    grid-template-columns: repeat(auto-fill, minmax(2.6em, 1fr));
  }
  .passage-citation-toc-widget * {
    display: block;
    text-align: center;
    font-size: 0.7rem;
    padding: 0.15rem 0;
  }
  .passage-citation-toc-widget a {
    border: none;
  }
  a:not(.active-textpart):hover {
    background: var(
      --sv-widget-passage-citation-toc-textpart-hover-background,
      #e9ecef
    );
  }
  .active-textpart {
    color: var(--sv-widget-passage-citation-toc-active-text-color, #000000);
    background: var(
      --sv-widget-passage-citation-toc-active-background-color,
      #dee2e6
    );
  }
</style>
