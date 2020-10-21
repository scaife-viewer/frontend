<template>
  <div class="attributions-container">
    <div
      :key="attribution.id"
      class="attribution-row"
      v-for="attribution in attributions"
    >
      <div class="value">{{ attribution.name }}</div>
      <div class="label">{{ attribution.role }}</div>
    </div>
  </div>
</template>

<script>
  import gql from 'graphql-tag';

  export default {
    name: 'Attributions',
    props: ['versionUrn'],
    // computed: {
    //   attributions() {
    //     return [
    //       {
    //         name: 'foo',
    //         role: 'bar',
    //       },
    //     ];
    //   },
    // },
    apollo: {
      attributions: {
        query: gql`
          query Attributions($urn: String!) {
            attributions(reference: $urn) {
              edges {
                node {
                  id
                  role
                  name
                }
              }
            }
          }
        `,
        variables() {
          return { urn: this.versionUrn };
        },
        update(data) {
          return data.attributions.edges.map(e => e.node);
        },
        skip() {
          return this.versionUrn === null;
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  .attributions-container {
    flex-direction: column;
    > * {
      font-size: 14px;
    }
    .attribution-row {
      > .label {
        color: var(--sv-widget-attribution-label-text-color, #868e96);
      }
      > .value {
        font-family: var(
          --sv-widget-attribution-value-font-family,
          'Noto Serif'
        );
      }
      flex-flow: row nowrap;
      margin: 0.75em 0;
    }
  }
</style>
