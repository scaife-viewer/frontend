<template v-if="siblings">
  <div class="passage-siblings-widget">
    <div
      class="grid-cell-square"
      v-for="sibling in siblings"
      :key="sibling.urn"
    >
      <ReaderLink
        :class="{ 'active-sibling': sibling.selected }"
        :urn="sibling.urn"
      >
        {{ sibling.lcp }}
      </ReaderLink>
    </div>
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import { ReaderLink } from '@scaife-viewer/common';
  import { MODULE_NS } from '@scaife-viewer/store';

  export default {
    name: 'PassageSiblingsWidget',
    components: { ReaderLink },
    scaifeConfig: {
      displayName: 'Siblings',
    },
    computed: {
      passage() {
        return this.$store.getters[`${MODULE_NS}/passage`];
      },
      siblings() {
        if (this.siblingsData === undefined) {
          return [];
        }
        const { selected } = this.siblingsData;
        return this.siblingsData.all.map(s => {
          return {
            ...s,
            selected: selected.filter(s2 => s2.urn === s.urn).length > 0,
          };
        });
      },
    },
    apollo: {
      siblingsData: {
        query: gql`
          query Siblings($urn: String!) {
            passageTextParts(reference: $urn) {
              metadata {
                siblings {
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
          const { all, selected } = data.passageTextParts.metadata.siblings;
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
  .passage-siblings-widget {
    width: 100%;
    display: grid;
    grid-auto-rows: 1fr;
    grid-template-columns: repeat(auto-fill, minmax(1.6em, 1fr));
  }
  .passage-siblings-widget * {
    display: block;
    text-align: center;
    font-size: 0.7rem;
    padding: 0.15rem 0;
  }
  .passage-siblings-widget a {
    border: none;
  }
  a:not(.active-sibling):hover {
    background: var(
      --sv-widget-passage-siblings-sibling-hover-background,
      #e9ecef
    );
  }
  .active-sibling {
    color: var(--sv-widget-passage-siblings-active-text-color, #000000);
    background: var(
      --sv-widget-passage-siblings-active-background-color,
      #dee2e6
    );
  }
</style>
