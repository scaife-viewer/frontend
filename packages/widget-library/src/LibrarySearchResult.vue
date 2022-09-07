<template>
  <p class="search-result" @click="handleClick">
    {{ JSON.stringify(result) }}
  </p>
</template>

<script>
  export default {
    name: 'LibrarySearchResult',
    props: ['result'],
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
    font-family: monospace;
    font-size: 0.8em;
    word-wrap: break-word;
  }
</style>
