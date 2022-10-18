<template>
  <div class="grammatical-entry" :class="{ selected }">
    <div
      class="grammatical-entry-title"
      @click.prevent="$emit('select', entry)"
    >
      <span>
        {{ entry.label }}
      </span>
      <span v-if="selected">x</span>
    </div>
    <div class="grammatical-entry-body" v-if="selected" :key="entry.id">
      <div
        class="grammatical-entry-content"
        v-if="entry.data.content"
        v-html="entry.data.content"
      />
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      entry: {
        type: Object,
        required: true,
      },
      selectedEntries: {
        type: Array,
        required: true,
      },
    },
    computed: {
      // FIXME: Mimic Dictionary Entry convention where we
      // resolve via a URN?
      // Also review commentary2 widget
      selected() {
        return (
          this.selectedEntries.filter(id => this.entry.id === id).length > 0
        );
      },
    },
  };
</script>

<style lang="scss" scoped>
  .grammatical-entry.selected {
    background: var(
      --sv-widget-grammatical-entries-selected-background-color,
      #f8f9fa
    );
    margin-left: -10px;
    padding: 3px 7px;
    border-left: 3px solid
      var(--sv-widget-grammatical-entries-selected-border-color, #343a40);
    .grammatical-entry-description {
      color: var(
        --sv-widget-grammatical-entries-selected-description-text-color,
        #495057
      );
    }
  }
  .grammatical-entry {
    margin: 0.375rem 0;
  }
  .grammatical-entry-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: var(--sv-widget-grammatical-entries-title-text-color, #343a40);
    cursor: pointer;
    &:hover {
      font-weight: 600;
    }
  }
</style>
