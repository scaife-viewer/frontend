<template>
  <div class="sentence">
    <template v-for="word in words">
      <Word :word="word" :key="word.id" :hovering-on="hoveringOn" @word-enter="onWordEnter" @word-leave="onWordLeave" />
      {{ ' ' }}
    </template>
  </div>
</template>

<script>
  import Word from './Word.vue';

  export default {
    props: ['words', 'hoveringOn'],
    components: { Word },
    methods: {
      onWordEnter(word) {
        this.$emit('word-enter', word);
      },
      onWordLeave(word) {
        this.$emit('word-leave', word);
      },
    },
  }
</script>

<style lang="scss" scoped>
</style>
