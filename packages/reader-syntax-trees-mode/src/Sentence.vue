<template>
  <div
    class="sentence"
    :class="[
      `text-${textSize}`,
      `text-width-${textWidth}`,
      selected.word !== null ? 'highlighting' : null,
    ]"
  >
    <span
      class="word-container"
      v-for="(word, position) in words"
      :key="word.id"
    >
      <br class="word-break-before" v-if="word.breakBefore" />
      <span class="ref" v-if="showRef(word, position)">{{ word.ref }}</span>
      <Word
        :key="word.id"
        :word="word"
        :selected="selected"
        :position="position"
        @word-enter="onWordEnter"
        @word-leave="onWordLeave"
      />
      <span v-if="spaceAfter(word)">{{ ' ' }}</span>
    </span>
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
      showRef(word, position) {
        // TODO: Add support for toggling refs on / off
        return (word.ref && position === 0) || word.breakBefore;
      },
      spaceAfter(word) {
        return word.spaceAfter !== undefined ? word.spaceAfter : true;
      },
    },
    computed: {
      textSize() {
        return this.$store.state[MODULE_NS].readerTextSize;
      },
      textWidth() {
        return this.$store.state[MODULE_NS].readerTextWidth;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .sentence {
    font-family: var(
      --sv-reader-syntax-trees-mode-sentence-font-family,
      'Noto Serif'
    );
    line-height: 1.8;
    display: table;

    &.highlighting {
      color: var(--sv-reader-syntax-trees-mode-noninvolved-text-color, #adb5bd);
    }
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
  .ref {
    font-size: 10pt;
    color: var(--sv-reader-syntax-trees-mode-ref-text-color, #69c);
    font-family: var(
      --sv-reader-syntax-trees-mode-ref-font-family,
      'Noto Sans'
    );
    margin-right: 1em;
  }
  // h/t https://stackoverflow.com/questions/1409649/how-to-change-the-height-of-a-br
  .word-break-before {
    display: block; /* makes it have a width */
    content: ''; /* clears default height */
    margin-top: 0.667em; /* additional margin from previous word*/
  }
</style>
