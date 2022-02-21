<template>
  <div class="passages-for-selected-lemmas">
    <div class="selected-lemma">
      {{ lemma }}
      <span>
        <span class="control-toggle" @click.prevent="$emit('clear')"
          ><icon class="icon" name="times"
        /></span>
      </span>
    </div>
    <LoaderBall v-if="$apollo.queries.passages.loading" />
    <EmptyMessage v-else-if="passages.length === 0">
      No passages found.
    </EmptyMessage>
    <div class="passages" v-else>
      <router-link
        v-for="(passage, index) in passages"
        :key="`passage-${index}`"
        :to="passageDestination(passage.urn)"
        :class="{ selected: isSelected(passage) }"
      >
        {{ passage.ref }}
      </router-link>
    </div>
  </div>
</template>

<script>
  // TODO: Consider refactoring this component with portions
  // of NamedEntitiesWidget
  import gql from 'graphql-tag';
  import { LoaderBall, EmptyMessage } from '@scaife-viewer/common';

  export default {
    props: ['lemmas', 'versionUrn', 'passage'],
    components: {
      LoaderBall,
      EmptyMessage,
    },
    computed: {
      lemma() {
        return this.lemmas[0];
      },
    },
    methods: {
      passageDestination(passageUrn) {
        // TODO: Persist lemma selection across page loads
        // also impact Word and ReaderToken selections
        return {
          name: this.$route.name,
          params: { urn: passageUrn },
          query: this.$route.query,
        };
      },
      isSelected(passage) {
        // TODO: This does not (yet!) account for ranges,
        // but we can mimic the passage siblings widget to do so in the future
        return passage.urn === `${this.passage}`;
      },
    },
    apollo: {
      passages: {
        query: gql`
          query Passages($lemma: String!, $versionUrn: String!) {
            textPartsByLemma(lemma: $lemma, versionUrn: $versionUrn) {
              edges {
                node {
                  id
                  ref
                  urn
                }
              }
            }
          }
        `,
        variables() {
          return { lemma: this.lemma, versionUrn: this.versionUrn };
        },
        update(data) {
          return data.textPartsByLemma.edges.map(e => e.node);
        },
        skip() {
          return this.versionUrn === null;
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  // TODO: Unify CSS vars with dictionary entries and passage siblings
  .passages {
    display: flex;
    flex-direction: column;
    // TODO: rem from siblings vs px from dictionary entry
    a {
      font-size: 0.7rem;
      padding: 0.15rem 0;
    }
    .selected {
      color: var(
        --sv-widget-passage-lemma-traversal-active-text-color,
        #000000
      );
      background: var(
        --sv-widget-passage-lemma-traversal-active-background-color,
        #dee2e6
      );
    }
  }
  .selected-lemma {
    display: flex;
    justify-content: space-between;
    color: var(--sv-widget-passage-lemma-traversal-lemma-text-color, #343a40);
    font-weight: 600;
    margin-bottom: 0.5em;
  }
  .control-toggle {
    font-weight: normal;
    color: var(--sv-widget-open-toggle-text-color, #ced4da);
    cursor: pointer;
    &:hover,
    &.active {
      color: var(
        --sv-widget-passage-lemma-traversal-controls-active-text-color,
        #343a40
      );
      font-weight: unset;
    }
  }
</style>
