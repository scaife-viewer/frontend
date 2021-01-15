<template>
  <div class="dictionary-entry" :class="{ selected }">
    <div class="headword" @click.prevent="$emit('select', entry)">
      <span>
        {{ entry.headword }}
      </span>
      <span v-if="selected">x</span>
    </div>
    <div class="dictionary-entry-body" v-if="selected">
      <!-- TODO: Use a tighter follow-on query here to reduce payload size -->
      <div
        class="dictionary-entry-content"
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
      selected() {
        return (
          this.selectedEntries.filter(id => this.entry.id === id).length > 0
        );
      },
    },
  };
</script>

<style lang="scss" scoped>
  .dictionary-entry.selected {
    background: var(
      --sv-widget-dictionary-entries-selected-background-color,
      #f8f9fa
    );
    margin-left: -10px;
    padding: 3px 7px;
    border-left: 3px solid
      var(--sv-widget-dictionary-entries-selected-border-color, #343a40);
    .dictionary-entry-content {
      color: var(
        --sv-widget-dictionary-entries-selected-content-text-color,
        #495057
      );
    }
  }
  .dictionary-entry {
    margin: 0.375rem 0;
  }
  .headword {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: var(--sv-widget-dictionary-entries-headword-text-color, #343a40);
    cursor: pointer;
    &:hover {
      font-weight: 600;
    }
  }
</style>
