<template>
  <div class="sentence">
    <template v-for="word in words">
      <Word
        :key="word.id"
        :word="word"
        :selected-word="selected"
        :selected-children="selectedChildren"
        :selected-parent="selectedParent"
        @word-enter="onWordEnter"
        @word-leave="onWordLeave"
      />
      {{ ' ' }}
    </template>
  </div>
</template>

<script>
  import Word from './Word.vue';

  export default {
    props: ['words', 'selected'],
    components: { Word },
    methods: {
      onWordEnter(word) {
        this.$emit('word-enter', word);
      },
      onWordLeave(word) {
        this.$emit('word-leave', word);
      },
    },
    computed: {
      wordIndex() {
        return this.words.reduce((map, word) => ({
          ...map,
          [word.id]: word,
        }), {});
      },
      selectedWord() {
        return this.wordIndex[this.selected];
      },
      selectedChildren() {
        return this.selectedWord && this.selectedWord.children.map(c => c.id);
      },
      selectedParent() {
        return this.selectedWord && this.selectedWord.headId;
      },
    }
  }
</script>

<style lang="scss" scoped>
</style>
