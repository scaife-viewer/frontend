<template v-if="ancestors">
  <div class="passage-ancestors-widget">
    <ol class="ancestors">
      <li class="ancestor" v-for="ancestor in ancestors" :key="ancestor.urn">
        <ReaderLink :key="ancestor.urn" :urn="ancestor.urn">
          {{ ancestor.ref }}
        </ReaderLink>
      </li>
    </ol>
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import { ReaderLink } from '@scaife-viewer/common';
  import { MODULE_NS } from '@scaife-viewer/store';

  export default {
    name: 'PassageAncestorsWidget',
    components: {
      ReaderLink,
    },
    scaifeConfig: {
      displayName: 'Ancestors',
    },
    computed: {
      passage() {
        return this.$store.getters[`${MODULE_NS}/passage`];
      },
    },
    apollo: {
      ancestors: {
        query: gql`
          query Ancestors($urn: String!) {
            passageTextParts(reference: $urn) {
              metadata {
                ancestors
              }
            }
          }
        `,
        variables() {
          return { urn: this.passage.absolute };
        },
        update(data) {
          return data.passageTextParts.metadata.ancestors;
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
  .passage-ancestors-widget {
    width: 100%;
  }
  .passage-ancestors-widget * {
    display: flex;
    font-size: 0.7rem;
  }
  .passage-ancestors-widget a {
    border: none;
  }
  .ancestors {
    padding: 0;
    list-style: none;
  }
  .ancestor + .ancestor::before {
    display: inline-block;
    padding-right: 0.25rem;
    padding-left: 0.25rem;
    content: '>';
  }
</style>
