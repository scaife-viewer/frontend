<template>
  <div class="repo-metadata-container" v-if="repos">
    <div class="repo-metadata-row" v-if="gitHubUrl">
      <div class="label">GitHub:</div>
      <a v-if="gitHubUrl" class="value" :href="gitHubUrl" target="_blank">
        {{ repo.name }}
      </a>
    </div>
    <div class="repo-metadata-row">
      <div class="label">Release SHA:</div>
      <div class="value">
        <a :href="repoTreeUrl" target="_blank">
          {{ sha }}
        </a>
      </div>
    </div>
    <div class="report-issue-link">
      <a :href="newIssueUrl" target="_blank">
        Report an issue with this passage
      </a>
    </div>
  </div>
</template>

<script>
  import gql from 'graphql-tag';

  import { MODULE_NS } from '@scaife-viewer/store';

  export default {
    name: 'RepoMetadata',
    props: ['versionUrn'],
    computed: {
      repo() {
        return this.repos.slice(0, 1)[0];
      },
      gitHubUrl() {
        return this.repo.metadata.githubUrl;
      },
      urn() {
        return this.$store.getters[`${MODULE_NS}/urn`];
      },
      sha() {
        return this.repo.sha.slice(0, 7);
      },
      ctsFilePath() {
        const [textGroup, workPart] = this.urn.work.split('.');
        return `data/${textGroup}/${workPart}/${this.urn.work}.xml`;
      },
      repoTreeUrl() {
        return `${this.gitHubUrl}/tree/${this.sha}/${this.ctsFilePath}`;
      },
      newIssueUrl() {
        const title = `Report an issue: ${this.urn}`;
        const body = `[${this.urn.work}.xml](${this.repoTreeUrl})`;
        return `${this.gitHubUrl}/issues/new?title=${title}&body=${body}`;
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
    .report-issue-link {
      font-size: var(--sv-report-issue-link-font-size, 10px);
    }
  }
</style>
