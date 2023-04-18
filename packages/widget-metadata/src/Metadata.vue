<template>
  <div class="metadata-container">
    <div class="metadata-row">
      <div class="label">Text Group:</div>
      <div class="value">{{ metadata.textGroupLabel }}</div>
    </div>
    <div class="metadata-row">
      <div class="label">Work:</div>
      <div class="value">{{ metadata.workLabel }}</div>
    </div>
    <div class="metadata-row">
      <div class="label">Version:</div>
      <div class="value">{{ metadata.label }}</div>
    </div>
    <div class="metadata-row">
      <div class="label">Language:</div>
      <div class="value">{{ metadata.humanLang }}</div>
    </div>
    <div class="metadata-row" v-if="showEditor">
      <div class="label">Editor:</div>
      <div class="value">
        <a :href="metadata.editor.url" target="_blank">{{
          metadata.editor.name
        }}</a>
      </div>
    </div>
    <div class="metadata-row" v-if="showRepository">
      <div class="label">Repository:</div>
      <div class="value">
        <a :href="metadata.repository.url" target="_blank">{{
          metadata.repository.name
        }}</a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Metadata',
    props: ['metadata', 'versionUrn'],
    computed: {
      showEditor() {
        const fallback = true;
        const config = this.$scaife.config.metadata;
        const shown = config ? config.showEditor : fallback;
        return shown && this.metadata.editor;
      },
      showRepository() {
        const fallback = true;
        const config = this.$scaife.config.metadata;
        const shown = config ? config.showRepository : fallback;
        return shown && this.metadata.repository;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .metadata-container {
    flex-direction: column;
    > * {
      font-size: 14px;
    }
    .metadata-row {
      > .label {
        color: var(--sv-widget-metadata-label-text-color, #868e96);
      }
      > .value {
        font-family: var(--sv-widget-metadata-value-font-family, 'Noto Serif');
      }
      > .version-urn,
      .value {
        margin-top: 0.25em;
      }
      flex-flow: row nowrap;
      margin: 0.5em 0;
    }
  }
</style>
