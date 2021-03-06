<template>
  <aside class="toc-container">
    <h3>{{ toc.title }}</h3>
    <p class="u-legend">{{ toc.description }}</p>
    <div class="toc-grid" v-if="toc.items.length">
      <template v-for="(item, index) in toc.items">
        <span :key="`index-${index}`" class="ref">{{ index + 1 }}.</span>
        <div :key="`item-${index}`" class="item">
          <router-link :to="getPayload(item.uri)">
            {{ item.title }}
          </router-link>
          <span v-if="showURNs">
            <tt>{{ item.uri }}</tt>
          </span>
        </div>
      </template>
    </div>
    <h4 v-else>No results.</h4>
  </aside>
</template>

<script>
  export default {
    name: 'TOC',
    props: ['toc', 'context', 'passage', 'showURNs'],
    methods: {
      isCiteUrn(urn) {
        return urn.startsWith('urn:cite:');
      },
      getCitePayloadInTocsContext(urn) {
        return { path: 'tocs', query: { urn } };
      },
      getCitePayloadInReaderContext(urn) {
        return {
          name: 'reader',
          params: { urn: this.passage.toString() },
          query: { toc: urn.toString() },
        };
      },
      getPayload(urn) {
        if (this.isCiteUrn(urn)) {
          return this.context === 'tocs'
            ? this.getCitePayloadInTocsContext(urn)
            : this.getCitePayloadInReaderContext(urn);
        }
        const query = { toc: this.$route.query.toc };
        return this.$route.query.toc
          ? { name: 'reader', params: { urn }, query }
          : { name: 'reader', params: { urn } };
      },
    },
  };
</script>

<style lang="scss" scoped>
  .toc-container {
    align-items: flex-start;
    flex-direction: column;
    width: 100%;
  }
  .toc-grid {
    display: grid;
    align-items: baseline;
    grid-template-columns: auto 9.25fr;
    grid-column-gap: 1em;
    > * {
      margin-bottom: 0.33em;
    }
  }
  p {
    margin: 0.66em 0;
  }
  span.ref {
    font-size: 10pt;
    color: var(--sv-widget-toc-ref-text-color, #69c);
    font-family: var(--sv-widget-toc-ref-font-family, 'Noto Sans');
    text-align: left;
  }
  .item {
    flex-direction: column;
  }
</style>
