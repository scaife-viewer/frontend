<template>
  <div class="library-widget">
    <LoaderBall v-if="$apolloData.queries.libraryTree.loading" />
    <ul class="node-tree root" v-else-if="libraryTree">
      <Node v-for="node in libraryTree" :key="node.data.urn" :node="node" />
    </ul>
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import { LoaderBall } from '@scaife-viewer/common';

  import Node from './Node.vue';

  export default {
    name: 'LibraryWidget',
    apollo: {
      libraryTree: {
        query: gql`
          {
            tree(urn: "urn:cts:", upTo: "version") {
              tree
            }
          }
        `,
        update(data) {
          const nid = data.tree.tree[0];
          return nid.children.reduce((a, b) => {
            return a.concat(b.children);
          }, []);
        },
      },
    },
    components: {
      LoaderBall,
      Node,
    },
    scaifeConfig: {
      displayName: 'Library',
    },
  };
</script>

<style lang="scss">
  .library-widget {
    margin: 0 auto 0 2em;
    width: 100%;
    overflow: auto;
  }
  ul.node-tree {
    padding: 0;
    flex-wrap: nowrap;
    margin-left: 1em;
    list-style: none;
    &.root {
      margin: 0 0 0.92em 0;
    }
  }
</style>
