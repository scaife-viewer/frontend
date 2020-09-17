<template>
  <div class="syntax-trees-toolbar">
    <a href :class="{ active: expandAll !== null }" @click.prevent="onShow">
      <icon :name="expandAll ? 'compress' : 'expand'" />
      {{ expandAll ? 'Collapse All' :  'Expand All'  }}
    </a>
  </div>
</template>

<script>
  export default {
    props: ['expandAll'],
    methods: {
      onShow() {
        this.$emit('show', !this.expandAll);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .syntax-trees-toolbar {
    display: flex;
    padding-bottom: 0.75rem;

    a:active {
      outline: none;
    }
    a:hover {
      border-color: var(--sv-syntax-trees-mode-toolbar-link-hover-border-color, #b45141);
      }
      a.active {
        border-color: transparent;
      }
  }
</style>
