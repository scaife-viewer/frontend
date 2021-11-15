<template>
  <div class="display-mode-widget">
    <div
      v-for="mode in displayModes"
      :key="mode.mode"
      :class="{ active: mode.active }"
      @click.prevent="setMode(mode)"
    >
      {{ mode.label }}
    </div>
  </div>
</template>

<script>
  import {
    MODULE_NS,
    LAYOUT_WIDTH_WIDE,
    SET_MAIN_LAYOUT_WIDTH_NORMAL,
    SET_MAIN_LAYOUT_WIDTH_WIDE,
  } from '@scaife-viewer/store';

  export default {
    scaifeConfig: {
      displayName: 'Display Mode',
      location: 'sidebar',
      singleton: true,
    },
    computed: {
      displayModes() {
        const { readerComponents } = this.$scaife.config;
        const displayMode = this.$store.getters[`${MODULE_NS}/displayMode`];
        return Object.keys(readerComponents).map(key => ({
          ...readerComponents[key].readerConfig,
          component: readerComponents[key],
          mode: key,
          active: displayMode === key,
        }));
      },
    },
    methods: {
      setMode(mode) {
        // TODO: Set this when entering from a URL too
        this.$store.dispatch(`${MODULE_NS}/setTextWidth`, {
          width: mode.textWidth || 'normal',
        });
        if (mode.layout === LAYOUT_WIDTH_WIDE) {
          this.$store.dispatch(`${MODULE_NS}/${SET_MAIN_LAYOUT_WIDTH_WIDE}`);
        } else {
          this.$store.dispatch(`${MODULE_NS}/${SET_MAIN_LAYOUT_WIDTH_NORMAL}`);
        }
        const query = {
          ...this.$route.query,
          mode: mode.mode,
        };
        delete query.rs;
        this.$router.replace({ query });
      },
    },
  };
</script>

<style lang="scss" scoped>
  // TODO: Mimic TextWidth further
  .active {
    color: var(--sv-widget-display-mode-active-text-color, #343a40);
  }
  .display-mode-widget {
    flex: 1;
    color: var(--sv-widget-display-mode-text-color, #adb5bd);

    div {
      padding-right: 20px;
      cursor: pointer;
      // @@@ this should be standard across all widgets
      font-family: var(--sv-widget-display-mode-font-family, 'Noto Serif');
      font-size: 14px;
    }
  }
</style>
