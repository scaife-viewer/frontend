<template>
  <div class="repo-metadata-container" v-if="repos">
    <div class="repo-metadata-row" v-if="repo.metadata.githubUrl">
      <div class="label">GitHub:</div>
      <a
        v-if="repo.metadata.githubUrl"
        class="value"
        :href="repo.metadata.githubUrl"
        target="_blank"
      >
        {{ repo.name }}
      </a>
    </div>
    <div class="repo-metadata-row">
      <div class="label">Release SHA:</div>
      <div class="value">{{ repo.sha }}</div>
    </div>
  </div>
</template>

<script>
  import gql from 'graphql-tag';

  export default {
    name: 'RepoMetadata',
    props: ['versionUrn'],
    computed: {
      repo() {
        return this.repos.slice(0, 1)[0];
      },
    },
    apollo: {
      repos: {
        query: gql`
          query RepoMetadata($urn: String!) {
            versions(urn: $urn) {
              edges {
                node {
                  repos {
                    edges {
                      node {
                        id
                        name
                        sha
                        metadata
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        variables() {
          return { urn: this.versionUrn };
        },
        update(data) {
          return data.versions.edges
            .map(edge => {
              return edge.node.repos.edges.map(repoEdge => repoEdge.node);
            })
            .flat();
        },
        skip() {
          return !this.versionUrn;
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  .repo-metadata-container {
    flex-direction: column;
    > * {
      font-size: 14px;
    }
    .repo-metadata-row {
      > .label {
        color: var(--sv-widget-repo-metadata-label-text-color, #868e96);
      }
      > .value {
        font-family: var(
          --sv-widget-repo-metadata-value-font-family,
          'Noto Serif'
        );
      }
      > .version-urn,
      .value {
        margin-top: 0.25em;
      }
      flex-flow: row nowrap;
      margin: 0.5em 0;
    }
  }
</style>
