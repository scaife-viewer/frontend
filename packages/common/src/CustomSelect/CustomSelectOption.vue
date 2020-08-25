<template>
  <div class="custom-selector--option" @click="onClick">
    <div class="label">{{ option.title }}</div>
  </div>
</template>

<script>
  export default {
    props: {
      option: {
        type: Object,
        required: true,
      },
    },
    methods: {
      onClick() {
        this.$emit('selected', this.option);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .custom-selector--option {
    padding: 0.5rem 0.75rem;
    display: flex;
    &:hover {
      background: var(--sv-common-custom-select-option-hover-background-color, #f8f9fa);
    }
    cursor: pointer;
    .label {
      padding-left: 5px;
      margin: auto 0;
    }
  }
</style>
