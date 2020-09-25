<template>
  <div class="empty-message">
    <slot>No content available</slot>
  </div>
</template>

<style lang="scss" scoped>
  .empty-message {
    font-size: var(--sv-empty-message-font-size, 14px);
    color: var(--sv-empty-message-text-color, #495057);
    padding: 0 0 0.4rem;
    font-style: italic;
    flex: 1;
  }
</style>
