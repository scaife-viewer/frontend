<template>
  <div class="search-result" @click="handleClick">
    <div>
      <span class="tg-label">{{ result.textGroupLabel }}</span>
      <span class="work-label">{{ result.workLabel }}</span>
    </div>
    <ReaderLink
      :title="result.versionLabel"
      :urn="result.firstPassageUrn"
      :noQuery="true"
      :class="{ highlight }"
    >
      {{ result.versionLabel }}
    </ReaderLink>
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
      readerUrn() {
        return this.$store.getters[`${MODULE_NS}/urn`];
      },
      highlight() {
        return (
          this.readerUrn && this.readerUrn.version === this.result.versionUrn
        );
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
    },
  };
</script>

<style lang="scss" scoped>
  .search-result {
    font-size: 0.8em;
    margin: 0.75em 0;
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
</style>
