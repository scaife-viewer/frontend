<template>
  <div class="page">
    <ContentSection>
      <slot />
    </ContentSection>
  </div>
</template>

<script>
  import ContentSection from './ContentSection.vue';

  export default {
    components: { ContentSection },
  };
</script>
<style lang="scss" scoped>
  .page {
    display: flex;
    justify-content: center;
    margin-top: 80px;
  }
</style>
