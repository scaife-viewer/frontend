<template>
  <div>
    <select v-model="selected">
      <option
        v-for="alignment in alignments"
        :key="alignment.id"
        :value="alignment.slug"
      >
        {{ alignment.name }}
      </option>
    </select>
  </div>
</template>

<script>
  export default {
    props: ['value', 'alignments'],
    watch: {
      selected() {
        this.$emit('input', this.selected);
      },
    },
    data() {
      return {
        selected: this.value,
      };
    },
  };
</script>

<style lang="scss" scoped></style>
