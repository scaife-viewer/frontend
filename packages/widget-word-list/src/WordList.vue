<template>
  <aside class="word-list-container">
    <div slot="sticky">
      <p class="u-legend">
        Number in parentheses is frequency per 10k in this work.
      </p>
    </div>
    <div v-for="word in wordList" :key="word.text" class="word-list">
      <p>
        <span class="w">{{ word.text }}</span>
        <span class="df">{{ word.shortdef }}</span>
        <span v-if="word.frequency" class="fr">({{ word.frequency }})</span>
      </p>
    </div>
  </aside>
</template>

<script>
  export default {
    name: 'WordList',
    props: ['wordList'],
  };
</script>

<style lang="scss" scoped>
  aside {
    flex-direction: column;
    width: 100%;
  }
  .word-list > p {
    font-family: var(--sv-widget-word-list-font-family, 'Noto Serif');
    font-size: 0.85rem;
    margin: 0.165em 0;
    span.w {
      font-weight: 700;
    }
    span.df {
      color: var(--sv-widget-word-list-df-text-color, #868e96);
      margin-left: 0.66em;
      margin-right: 0.66em;
    }
  }
</style>
