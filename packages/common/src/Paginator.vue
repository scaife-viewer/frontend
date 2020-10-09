<template>
  <nav class="paginator" :key="urnString">
    <ReaderLink v-if="urn" :urn="urnString">
      <Icon :name="icon" />
    </ReaderLink>
    <span v-else class="disabled"><Icon :name="icon" /></span>
  </nav>
</template>

<script>
  import ReaderLink from './ReaderLink.vue';
  import Icon from './Icon.vue';

  export default {
    name: 'Paginator',
    props: ['urn', 'direction'],
    components: { Icon, ReaderLink },
    computed: {
      icon() {
        return `chevron-${this.direction}`;
      },
      urnString() {
        return this.urn && this.urn.toString();
      },
    },
  };
</script>

<style lang="scss" scoped>
  nav.paginator {
    min-width: 5em;
    width: auto;
    position: sticky;
    top: 2em;
    text-align: center;
    align-self: flex-start;

    height: calc(100vh - 1px - 30px - 54px - 1px - 8px);
    a,
    .disabled {
      display: flex;
      justify-content: center;
      flex-direction: column;
      height: calc(100vh - 86px);
      align-items: center;
      font-size: 36px;
    }
    a {
      color: var(--sv-paginator-link-text-color, #adb5bd);
    }
    a:hover {
      color: var(--sv-paginator-link-hover-text-color, #343a40);
      background: var(--sv-paginator-link-hover-background-color, #f8f9fa);
    }
    .disabled {
      color: var(--sv-paginator-disabled-text-color, #dee2e6);
    }
  }
</style>
