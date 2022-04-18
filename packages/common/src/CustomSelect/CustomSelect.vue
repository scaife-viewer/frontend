<template>
  <div class="sv-custom-select">
    <div class="sv-custom-select--selected" @click="open = !open">
      <div class="title">
        <div v-if="value" class="label">{{ value.title }}</div>
        <div v-else-if="placeholder" class="placeholder label">
          {{ placeholder }}
        </div>
      </div>
      <div class="chevron"><icon name="chevron-down" /></div>
    </div>
    <div class="sv-custom-select--options" v-if="open">
      <CustomSelectOption
        v-for="(option, index) in options"
        :key="index"
        :option="option"
        @selected="onSelected"
      />
    </div>
  </div>
</template>

<script>
  import CustomSelectOption from './CustomSelectOption.vue';

  export default {
    props: {
      value: {
        required: true,
      },
      options: {
        type: Array,
        required: true,
      },
      placeholder: {
        type: String,
        required: false,
        default: 'Select...',
      },
    },
    components: { CustomSelectOption },
    data() {
      return {
        open: false,
      };
    },
    methods: {
      onSelected(option) {
        this.$emit('input', option);
        this.open = false;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .sv-custom-select {
    position: relative;
    margin: 10px 0;
  }
  .sv-custom-select--options {
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    border: 1px solid var(--sv-custom-select-options-border-color, #dee2e6);
    background: var(--sv-custom-select-options-background-color, white);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
    z-index: 999;
  }
  .sv-custom-select--selected {
    border: 1px solid var(--sv-custom-select-selected-border-color, #dee2e6);
    border-radius: 3px;
    padding: 0.5rem 0.75rem;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    .title {
      display: flex;
      .label {
        padding-left: 5px;
        margin: auto 0;
      }
    }
    &:hover {
      .chevron {
        color: var(
          --sv-custom-select-selected-hover-chevron-text-color,
          #343a40
        );
      }
    }
  }
  .chevron {
    color: var(--sv-custom-select-selected-hover-chevron-text-color, #adb5bd);
  }
</style>
