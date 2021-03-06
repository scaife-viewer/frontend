<template>
  <div class="toc-widget" v-if="toc">
    <div class="lookahead-container">
      <Lookahead
        :placeholder="placeholder"
        :reducer="reducer"
        :data="toc"
        @filter-data="filterData"
      />
      <Icon class="icon" name="home" v-if="showingRootToc" disabled />
      <router-link class="icon" :to="returnToRootPayload" v-else>
        <Icon name="home" />
      </router-link>
      <span @click.prevent="toggleURNs">
        <Icon class="icon urn" name="eye" v-if="!showURNs" />
        <Icon class="icon urn" name="eye-slash" v-else />
      </span>
    </div>
    <TOC
      :toc="filtered || toc"
      :context="context"
      :passage="passage"
      :showURNs="showURNs"
    />
  </div>
</template>

<script>
  import { Icon, Lookahead } from '@scaife-viewer/common';
  import { MODULE_NS } from '@scaife-viewer/store';

  import TOC from './TOC.vue';
  import reducers from './reducers';

  export default {
    name: 'TOCWidget',
    components: {
      Icon,
      Lookahead,
      TOC,
    },
    scaifeConfig: {
      displayName: 'Table of Contents',
    },
    created() {
      this.fetchData();
    },
    watch: {
      $route: 'fetchData',
      defaultTocUrn: 'fetchData',
    },
    data() {
      return {
        toc: null,
        filtered: null,
        showURNs: false,
      };
    },
    computed: {
      context() {
        return this.$route.name;
      },
      placeholder() {
        return 'Filter this table of contents...';
      },
      passage() {
        return this.$store.getters[`${MODULE_NS}/passage`];
      },
      metadata() {
        return this.$store.getters[`${MODULE_NS}/metadata`];
      },
      reducer() {
        return reducers.tocReducer;
      },
      endpoint() {
        return this.$scaife.endpoints.tocEndpoint;
      },
      returnToRootPayload() {
        return this.context === 'tocs'
          ? { path: 'tocs' }
          : { name: 'reader', params: { urn: this.passage.absolute } };
      },
      showingRootToc() {
        if (this.context === 'tocs') {
          return !this.$route.params.urn;
        }
        if (this.$route.query.toc) {
          return this.$route.query.toc === this.defaultTocUrn;
        }
        return this.defaultTocUrn
          ? this.url === this.getTocUrl(this.defaultTocUrn)
          : this.url === this.getTocUrl(this.rootTocUrn);
      },
      defaultTocUrn() {
        return this.metadata && this.metadata.defaultTocUrn
          ? this.metadata.defaultTocUrn
          : null;
      },
      rootTocUrn() {
        return 'urn:cite:scaife-viewer:toc.demo-root';
      },
      url() {
        if (this.$route.query.toc) {
          return this.getTocUrl(this.$route.query.toc);
        }
        if (this.context === 'reader') {
          return this.getTocUrl(this.defaultTocUrn || this.rootTocUrn);
        }
        return this.getTocUrl(this.$route.query.urn || this.rootTocUrn);
      },
    },
    methods: {
      toggleURNs() {
        this.showURNs = !this.showURNs;
      },
      filterData(data) {
        this.filtered = data;
      },
      fetchData() {
        fetch(this.url)
          .then(response => response.json())
          .then(data => {
            this.toc = data;
            this.filtered = null;
          })
          .catch(error => {
            // eslint-disable-next-line no-console
            console.log(error.message);
          });
      },
      getTocUrl(tocUrn) {
        return `${this.endpoint}/tocs/${tocUrn.split(':').slice(-1)}.json`;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .toc-widget {
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
  }
  .lookahead-container {
    align-items: center;
    margin-bottom: 0.66em;
    .form-group {
      width: 90%;
    }
  }
  .icon {
    color: var(--sv-widget-toc-icon-text-color, black);
    margin-left: 0.66em;
    &.urn {
      cursor: pointer;
    }
  }
</style>
