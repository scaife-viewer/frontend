<template>
  <router-link :to="{ name, params: { urn }, query }" :title="title">
    <slot />
  </router-link>
</template>

<script>
  export default {
    props: {
      urn: String,
      noQuery: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        default: null,
      }
    },
    computed: {
      name() {
        return this.$scaife.config.readerRouteName || 'reader';
      },
      query() {
        return this.noQuery ? null : this.$route.query;
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>
