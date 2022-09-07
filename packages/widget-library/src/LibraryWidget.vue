<template>
  <div class="library-widget">
    <LoaderBall v-if="$apolloData.queries.libraryTree.loading" />
    <ul class="node-tree root" v-else-if="libraryTree">
      <Lookahead
        class="version-lookahead"
        :placeholder="typeaheadPlaceholder"
        :reducer="lookaheadReducer"
        :data="versions"
        @filter-data="onFilter"
      />
      <!-- TODO: Affordance for clearing results -->
      <div v-if="displaySearchResults">
        <LibrarySearchResult
          v-for="(result, idx) in regroupedResults"
          :key="idx"
          :result="result"
        />
        <p v-if="searchResults.length == 0">
          <em>No results found.</em>
        </p>
      </div>
      <div v-else>
        <Node v-for="node in libraryTree" :key="node.data.urn" :node="node" />
      </div>
    </ul>
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import { LoaderBall, Lookahead } from '@scaife-viewer/common';

  import Node from './Node.vue';
  import LibrarySearchResult from './LibrarySearchResult.vue';

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
      LibrarySearchResult,
      LoaderBall,
      Lookahead,
      Node,
    },
    scaifeConfig: {
      displayName: 'Library',
    },
    data() {
      return {
        typeaheadEnabled: true,
        searchResults: null,
        displaySearchResults: false,
        // typeaheadPlaceholder:
        //   'Find a text group or work... (e.g. Plato or Apology)',
        typeaheadPlaceholder: 'Find a text group or work...',
      };
    },
    computed: {
      versions() {
        if (!this.libraryTree) {
          return [];
        }
        const data = this.libraryTree.map(textGroup => {
          return textGroup.children.map(work => {
            return work.children.map(version => {
              return {
                versionLabel: version.data.metadata.label,
                workLabel: work.data.metadata.label,
                workUrn: work.data.urn,
                textGroupLabel: textGroup.data.metadata.label,
                textGroupUrn: textGroup.data.urn,
                versionUrn: version.data.urn,
                firstPassageUrn:
                  version.data.metadata.firstPassageUrn || version.data.urn,
              };
            });
          });
        });
        return data
          .reduce((a, b) => {
            return a.concat(b);
          })
          .reduce((a, b) => {
            return a.concat(b);
          });
      },
      regroupedResults() {
        const byTextGroup = new Map();
        this.searchResults.forEach(version => {
          const key = version.textGroupUrn
          const versions = byTextGroup.get(key) || [];
          versions.push(version);
          byTextGroup.set(key, versions);
        });
        const regrouped = byTextGroup.values();
        return regrouped;
      },
    },
    methods: {
      lookaheadReducer(data, query) {
        // TODO: Determine if we should "group" at workLabel
        return data.filter(version => {
          const labels = [
            version.versionLabel,
            version.workLabel,
            version.textGroupLabel,
          ];
          return (
            // TODO: Review prior normalization implementations
            labels.filter(label =>
              label.toLowerCase().includes(query.toLowerCase()),
            ).length > 0
          );
        });
      },
      onFilter(data, query) {
        // TODO: Regroup results similar to SV 1
        this.searchResults = data;
        if (query) {
          this.displaySearchResults = true;
        } else {
          this.displaySearchResults = false;
        }
      },
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
  .version-lookahead {
    // TODO: Determine where to fix this style issue
    max-width: 90%;
  }
</style>
