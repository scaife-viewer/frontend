<template>
  <div class="sv-custom-selector--option" @click="onClick">
    <div class="label" v-html="option.title" />
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
  .sv-custom-selector--option {
    padding: 0.5rem 0.75rem;
    display: flex;
    &:hover {
      background: var(
        --sv-custom-select-option-hover-background-color,
        #f8f9fa
      );
    }
    cursor: pointer;
    .label {
      padding-left: 5px;
      margin: auto 0;
    }
  }
</style>
