<template>
  <div class="syntax-trees-toolbar">
    <a href :class="{ active: showText }" @click.prevent="onShowText">
      <icon name="align-left" />
    </a>
    <a href :class="{ active: showGraph }" @click.prevent="onShowGraph">
      <icon name="sitemap" />
    </a>
    <a href :class="{ active: showBoth }" @click.prevent="onShowBoth">
      <icon name="align-left" /> |
      <icon name="sitemap" />
    </a>
  </div>
</template>

<script>
  import {
    SYNTAX_TREES_STATE_TEXT,
    SYNTAX_TREES_STATE_GRAPH,
    SYNTAX_TREES_STATE_BOTH,
  } from './constants';

  export default {
    props: ['show'],
    computed: {
      showText() {
        return this.show === SYNTAX_TREES_STATE_TEXT;
      },
      showGraph() {
        return this.show === SYNTAX_TREES_STATE_GRAPH;
      },
      showBoth() {
        return this.show === SYNTAX_TREES_STATE_BOTH;
      },
    },
    methods: {
      onShowText() {
        this.$emit('show', SYNTAX_TREES_STATE_TEXT);
      },
      onShowGraph() {
        this.$emit('show', SYNTAX_TREES_STATE_GRAPH);
      },
      onShowBoth() {
        this.$emit('show', SYNTAX_TREES_STATE_BOTH);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .syntax-trees-toolbar {
    display: flex;
    padding-bottom: 0.75rem;
    a {
      margin: 0 0.5rem;
      padding: 0.25rem;
      border-radius: 3px;
      border: 1px solid transparent;
      &:first-child {
        margin-left: 0;
      }
    }
    a:hover {
      border-color: var(--sv-syntax-trees-mode-toolbar-link-hover-border-color, #b45141);
    }
    a.active {
      font-weight: 700;
      background: var(--sv-syntax-trees-mode-toolbar-link-background-color, #b45141);
      color: var(--sv-syntax-trees-mode-toolbar-link-text-color, #FFF);
      border-color: transparent;
    }
  }
</style>
