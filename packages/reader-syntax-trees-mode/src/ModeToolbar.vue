<template>
  <div class="syntax-trees-toolbar">
    <a href :class="{ active }" @click.prevent="onShow">
      <icon :name="iconName" />
      {{ expanded ? 'Collapse All' :  'Expand All'  }}
    </a>
  </div>
</template>

<script>
  import { MODE_EXPAND, MODE_COMPRESS } from './constants';

  export default {
    props: ['expandAll'],
    methods: {
      onShow() {
        this.$emit(
          'show',
          [null, MODE_COMPRESS].indexOf(this.expandAll) > -1
          ? MODE_EXPAND
          : MODE_COMPRESS
        );
      },
    },
    computed: {
      active() {
        return this.expandAll !== null;
      },
      iconName() {
        return this.expandAll || MODE_EXPAND;
      },
      expanded() {
        return this.expandAll === MODE_EXPAND;
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
