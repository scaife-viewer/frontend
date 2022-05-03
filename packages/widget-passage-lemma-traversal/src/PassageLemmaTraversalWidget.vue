<template>
  <div class="passage-lemma-traversal-widget">
    <PassageLemmaTraversal
      v-if="lemmas && versionUrn"
      :lemmas="lemmas"
      :versionUrn="versionUrn"
      :passage="passage"
      @clear="clearSelectedLemma"
    />
    <EmptyMessage v-else>
      No lemma selected
    </EmptyMessage>
  </div>
</template>

<script>
  import { MODULE_NS, SET_SELECTED_LEMMAS } from '@scaife-viewer/store';
  import { EmptyMessage } from '@scaife-viewer/common';

  import PassageLemmaTraversal from './PassageLemmaTraversal.vue';

  export default {
    name: 'PassageLemmaTraversalWidget',
    components: {
      EmptyMessage,
      PassageLemmaTraversal,
    },
    scaifeConfig: {
      displayName: 'Lemma Occurrences',
    },
    computed: {
      passage() {
        return this.$store.getters[`${MODULE_NS}/passage`];
      },
      versionUrn() {
        return this.passage.version;
      },
      lemmas() {
        return this.$store.getters[`${MODULE_NS}/selectedLemmas`];
      },
    },
    methods: {
      clearSelectedLemma() {
        // TODO: Unify clearing of selections
        this.$store.commit(`${MODULE_NS}/${SET_SELECTED_LEMMAS}`, {
          lemmas: null,
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .passage-lemma-traversal-widget {
    flex-direction: column;
    justify-content: flex-start;
    min-width: 0;
    width: 100%;
  }
</style>
