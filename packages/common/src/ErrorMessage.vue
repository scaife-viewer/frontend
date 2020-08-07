<template>
  <div class="error-message">
    <slot />
  </div>
</template>

<script>
  export default {};
</script>

<style lang="scss" scoped>
  .error-message {
    border: 1px solid var(--sv-error-message-border-color, #9b4436);
    background: var(--sv-error-message-background-color, #f0ccc6);
    color: var(--sv-error-message-text-color, #9b4436);
    border-radius: 5px;
    padding: 1rem 3rem;
    text-align: center;
    font-size: 18px;
    margin-top: 40px;
  }
</style>
