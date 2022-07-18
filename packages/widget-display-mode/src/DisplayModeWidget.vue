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
      displayModeKey() {
        return this.$store.getters[`${MODULE_NS}/displayMode`];
      },
      displayMode() {
        return this.displayModes.filter(
          mode => mode.mode === this.displayModeKey,
        )[0];
      },
      displayModes() {
        const { readerComponents } = this.$scaife.config;
        return Object.keys(readerComponents).map(key => ({
          ...readerComponents[key].readerConfig,
          component: readerComponents[key],
          mode: key,
          active: this.displayModeKey === key,
        }));
      },
    },
    methods: {
      setMode(mode) {
        // NOTE: `displayMode` getter reads from
        // $route.query.mode
        const query = {
          ...this.$route.query,
          mode: mode.mode,
        };
        delete query.rs;
        this.$router.replace({ query });
      },
      applyModeLayout(mode) {
        this.$store.dispatch(`${MODULE_NS}/setTextWidth`, {
          width: mode.textWidth || 'normal',
        });
        if (mode.layout === LAYOUT_WIDTH_WIDE) {
          this.$store.dispatch(`${MODULE_NS}/${SET_MAIN_LAYOUT_WIDTH_WIDE}`);
        } else {
          this.$store.dispatch(`${MODULE_NS}/${SET_MAIN_LAYOUT_WIDTH_NORMAL}`);
        }
      },
      applyAnnotationToggles(mode) {
        const { annotationDefaults } = mode;
        if (annotationDefaults) {
          Object.entries(annotationDefaults).forEach(entry => {
            const [propertyName, value] = entry;
            this.$store.state[MODULE_NS][propertyName] = value;
          });
        }
      },
    },
    watch: {
      displayMode: {
        immediate: true,
        handler(newVal, oldVal) {
          if (!oldVal || newVal.mode !== oldVal.mode) {
            this.applyModeLayout(newVal);
            this.applyAnnotationToggles(newVal);
          }
        },
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
