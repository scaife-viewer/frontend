<template>
  <section class="content-section">
    <slot />
  </section>
</template>

<style lang="scss" scoped>
  .content-section {
    width: 1200px;
    margin: 0 1.5em;

    @media (min-width: 576px) {
      max-width: 540px;
    }

    @media (min-width: 768px) {
      max-width: 720px;
    }

    @media (min-width: 992px) {
      max-width: 960px;
    }

    @media (min-width: 1200px) {
      max-width: 1140px;
    }
  }
</style>
