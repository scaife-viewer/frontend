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
  import { MODULE_NS, SET_DISPLAY_MODE } from '@scaife-viewer/store';

  export default {
    scaifeConfig: {
      displayName: 'Display Mode',
      location: 'sidebar',
      singleton: true,
    },
    computed: {
      displayModes() {
        const { readerComponents } = this.$scaife.config;
        return Object.keys(readerComponents).map(key => ({
          ...readerComponents[key].readerConfig,
          component: readerComponents[key],
          mode: key,
          active: this.$store.state[MODULE_NS].displayMode === key,
        }));
      },
    },
    methods: {
      setWideLayout() {
        document
          .getElementsByClassName('main-layout')[0]
          .classList.add('main-layout-wide');
      },
      setNormalLayout() {
        document
          .getElementsByClassName('main-layout')[0]
          .classList.remove('main-layout-wide');
      },
      setMode(mode) {
        this.$store.dispatch(`${MODULE_NS}/${SET_DISPLAY_MODE}`, { mode: mode.mode });
        this.$store.dispatch(`${MODULE_NS}/setTextWidth`, {
          width: mode.textWidth || 'normal',
        });
        if (mode.layout === 'wide') {
          this.setWideLayout();
        } else {
          this.setNormalLayout();
        }
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
    margin: 0 2em;
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
