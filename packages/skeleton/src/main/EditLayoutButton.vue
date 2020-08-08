<template>
  <a
    href
    @click.prevent="$emit('editToggle')"
    class="edit-layout-button"
    :class="{ editing }"
  >
    <template v-if="editing">Done</template>
    <Icon v-else name="cog" />
  </a>
</template>
<script>
  export default {
    props: ['editing'],
  };
</script>
<style lang="scss">
  .edit-layout-button {
    color: var(--sv-edit-layout-button-text-color, #dee2e6);
    border: none;
    font-size: 14px;
    &:hover {
      color: var(--sv-edit-layout-button-hover-text-color, #495057);
    }
    &.editing {
      background:  var(--sv-edit-layout-button-editing-background-color, #dee2e6);
      color: var(--sv-edit-layout-button-editing-text-color, #495057);
      text-decoration: none;
      margin-top: -5px; // to make DONE line up with heading
      padding: 5px 10px;
      &:hover {
        background: var(--sv-edit-layout-button-editing-hover-background-color, #ced4da);
      }
    }
  }
</style>
