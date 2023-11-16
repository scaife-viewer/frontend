<template>
  <div class="display-mode-widget">
    <LoaderBall v-if="$apollo.queries.displayModeHints.loading" />
    <template v-else>
      <div
        v-for="mode in availableDisplayModes"
        :key="mode.mode"
        :class="{ active: mode.active }"
        @click.prevent="setMode(mode)"
      >
        {{ displayModeLabel(mode.label) }}
      </div>
    </template>
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import { displayName } from '@scaife-viewer/common';
  import {
    MODULE_NS,
    DISPLAY_MODE_DEFAULT,
    DISPLAY_MODE_FALLBACK,
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
      version() {
        const urn = this.$store.getters[`${MODULE_NS}/urn`];
        return urn ? urn.version : null;
      },
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
          available: this.displayModeHints ? this.displayModeHints[key] : false,
        }));
      },
      availableDisplayModes() {
        if (this.displayModeHints) {
          return this.displayModes.filter(mode => mode.available);
        }
        return this.displayModes.filter(
          mode => mode.mode === DISPLAY_MODE_DEFAULT,
        );
      },
    },
    apollo: {
      displayModeHints: {
        query: gql`
          query DisplayModeHints($urn: String!) {
            versions(urn: $urn) {
              edges {
                node {
                  id
                  displayModeHints
                }
              }
            }
          }
        `,
        variables() {
          return { urn: `${this.version}` };
        },
        update(data) {
          return data.versions.edges[0].node.displayModeHints;
        },
        skip() {
          return this.version === null;
        },
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
      displayModeLabel(name) {
        return displayName(name, this.$store.getters, this.$scaife);
      },
    },
    watch: {
      displayMode: {
        immediate: true,
        handler(newVal, oldVal) {
          if (
            newVal &&
            this.$apollo.queries.displayModeHints &&
            !this.$apollo.queries.displayModeHints.loading &&
            !newVal.available
          ) {
            // NOTE: This is a guard rail added to prevent the user
            // from navigating into a bad reader state
            // FIXME: We might want an additional check to switch between
            // default and fallback modes; below is a start.
            let toSet = DISPLAY_MODE_DEFAULT;
            if (newVal.mode === DISPLAY_MODE_DEFAULT && !newVal.available) {
              toSet = DISPLAY_MODE_FALLBACK;
            }
            this.setMode({ mode: toSet });
          }
          if (!oldVal || newVal.mode !== oldVal.mode) {
            this.applyModeLayout(newVal);
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
