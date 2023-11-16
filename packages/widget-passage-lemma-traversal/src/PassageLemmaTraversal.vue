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
    <LoaderBall v-if="$apollo.queries.passageTokens.loading" />
    <EmptyMessage v-else-if="passageTokens && passageTokens.length === 0">
      No passages found.
    </EmptyMessage>
    <table class="passages" v-else>
      <PassageLemmaToken
        v-for="(token, index) in passageTokens"
        :key="`passage-${index}`"
        :token="token"
        :passage="passage"
      />
    </table>
  </div>
</template>

<script>
  // TODO: Consider refactoring this component with portions
  // of NamedEntitiesWidget
  import gql from 'graphql-tag';

  import { LoaderBall, EmptyMessage } from '@scaife-viewer/common';

  import PassageLemmaToken from './PassageLemmaToken.vue';

  export default {
    props: ['lemmas', 'versionUrn', 'passage'],
    components: {
      LoaderBall,
      EmptyMessage,
      PassageLemmaToken,
    },
    computed: {
      lemma() {
        return this.lemmas[0];
      },
    },
    apollo: {
      passageTokens: {
        query: gql`
          query Tokens($lemma: String!, $versionUrn: String!) {
            tokenAnnotationsByLemma(lemma: $lemma, versionUrn: $versionUrn) {
              edges {
                node {
                  id
                  data
                  textPartUrn
                }
              }
            }
          }
        `,
        variables() {
          return { lemma: this.lemma, versionUrn: this.versionUrn };
        },
        update(data) {
          // TODO: Worth denorming passages, or just allow duplicates
          // if present?
          return data.tokenAnnotationsByLemma.edges.map(e => e.node);
        },
        skip() {
          return this.versionUrn === null || !this.lemma;
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  // TODO: Unify CSS vars with:
  // - dictionary entries
  // - passage siblings
  // - token annotations
  .passages {
    border-spacing: 0 0.25em;
    width: 100%;
    color: var(
      --sv-widget-passage-lemma-traversal-annotation-text-color,
      #495057
    );
    font-size: 12px;
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
