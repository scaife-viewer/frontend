<template>
  <div class="sentence" :class="[`text-${textSize}`, `text-width-${textWidth}`]">
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
  import { MODULE_NS } from '@scaife-viewer/store';
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
      textSize() {
        return this.$store.state[MODULE_NS].readerTextSize;
      },
      textWidth() {
        return this.$store.state[MODULE_NS].readerTextWidth;
      },
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
  .sentence {
    font-family: var(--widget-reader-text-font-family, 'Noto Serif');
    line-height: 1.8;
  }


  .text-xs {
    font-size: 12px;
  }
  .text-sm {
    font-size: 14px;
  }
  .text-md {
    font-size: 16px;
  }
  .text-lg {
    font-size: 20px;
  }
  .text-xl {
    font-size: 24px;
  }

  .text-width-narrow {
    max-width: 20em;
  }

  .text-width-normal {
    max-width: 30em;
  }

  .text-width-wide {
    max-width: 40em;
  }

  .text-width-full {
    max-width: 100%;
  }
</style>
