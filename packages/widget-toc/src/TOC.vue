<template>
  <aside class="toc-container">
    <h3>{{ toc.label }}</h3>
    <p class="u-legend">{{ toc.description }}</p>
    <div class="toc-grid">
      <template v-for="(item, index) in toc.items">
        <span :key="`index-${index}`" class="ref">{{ index + 1 }}.</span>
        <div :key="`item-${index}`" class="item">
          <router-link :to="getPayload(item.uri)">
            {{ item.label }}
          </router-link>
          <span v-if="showURNs">
            <tt>{{ item.uri }}</tt>
          </span>
        </div>
      </template>
    </div>
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
        const query = {
          ...this.$route.query,
          toc: urn.toString(),
        };
        return {
          name: 'reader',
          params: { urn: this.passage.toString() },
          query,
        };
      },
      getPayload(urn) {
        if (this.isCiteUrn(urn)) {
          return this.context === 'tocs'
            ? this.getCitePayloadInTocsContext(urn)
            : this.getCitePayloadInReaderContext(urn);
        }
        const query = {
          ...this.$route.query,
          toc: this.$route.query.toc,
        };
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
  // TODO: Retire grid due to weird wrapping issues
  .toc-grid {
    display: grid;
    align-items: baseline;
    // NOTE: Prior behavior was auto 9.25fr;
    // This may be better implemented as an ordered
    // unordered list than a grid
    grid-template-columns: var(
      --sv-widget-toc-toc-grid-grid-template-columns,
      auto
    );
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
    // NOTE: Set to block to display refs
    display: var(--sv-widget-toc-ref-display, none);
  }
  .item {
    flex-direction: column;
    display: var(--sv-widget-toc-item-display, grid);
  }
</style>
