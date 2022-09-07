<template>
  <div class="search-result" @click="handleClick">
    <div
      v-for="(versions, workIdx) in versionsByWork"
      :key="workIdx"
      class="result-row"
    >
      <div>
        <span class="tg-label">{{ textGroupLabel }}</span>
        <span class="work-label">{{ workLabel(versions[0]) }}</span>
      </div>
      <ReaderLink
        v-for="(version, idx) in versions"
        :key="idx"
        :title="version.versionLabel"
        :urn="version.firstPassageUrn"
        :noQuery="true"
        :class="{ highlight: highlight(version), 'version-link': true }"
      >
        {{ version.versionLabel }}
      </ReaderLink>
    </div>
  </div>
</template>

<script>
  import { MODULE_NS } from '@scaife-viewer/store';
  import { ReaderLink } from '@scaife-viewer/common';

  export default {
    name: 'LibrarySearchResult',
    props: ['result'],
    components: {
      ReaderLink,
    },
    computed: {
      textGroupLabel() {
        return this.versions[0].textGroupLabel;
      },
      versions() {
        return this.result;
      },
      readerUrn() {
        return this.$store.getters[`${MODULE_NS}/urn`];
      },
      versionsByWork() {
        const byWork = new Map();
        this.result.forEach(version => {
          const key = version.workUrn;
          const versions = byWork.get(key) || [];
          versions.push(version);
          byWork.set(key, versions);
        });
        const regrouped = byWork.values();
        return regrouped;
      },
    },
    methods: {
      handleClick() {
        // TODO: Refactor using ReaderLink component
        this.$router.push({
          to: 'reader',
          params: { urn: this.result.urn },
          query: this.$route.query,
        });
      },
      highlight(version) {
        return this.readerUrn && this.readerUrn.version === version.versionUrn;
      },
      workLabel(version) {
        return version.workLabel;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .search-result {
    font-size: 0.8em;
    margin: 0.75em 0;
  }
  .result-row {
    margin-bottom: 1em;
  }
  .tg-label {
    font-weight: bold;
    color: gray;
  }
  .work-label {
    margin-left: 1em;
    font-style: italic;
    color: gray;
  }
  .highlight {
    font-weight: 700;
  }
  .version-link {
    margin: 0.25em 0;
    display: block;
  }
</style>
