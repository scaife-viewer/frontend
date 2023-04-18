<template>
  <table class="selected-tokens" :key="urn.absolute">
    <tr v-if="tokens.length === 0">
      <EmptyMessage />
    </tr>
    <tr colspan="3" v-else-if="selectedToken">
      <a href @click.prevent="onClear">Clear Filter</a>
    </tr>
    <tr v-for="token in tokens" :key="token.veRef">
      <th class="text">{{ token.value }}</th>
      <td class="parse">{{ token.tag }}</td>
      <td class="text">{{ token.lemma }}</td>
    </tr>
  </table>
</template>

<script>
  import gql from 'graphql-tag';
  import { EmptyMessage } from '@scaife-viewer/common';
  import { MODULE_NS, CLEAR_TOKEN, SELECT_TOKEN } from '@scaife-viewer/store';

  export default {
    scaifeConfig: {
      displayName: 'Token Annotations',
    },
    methods: {
      onClear() {
        this.$store.dispatch(`${MODULE_NS}/${CLEAR_TOKEN}`);
      },
    },
    components: { EmptyMessage },
    computed: {
      selectedToken() {
        return this.$store.state[MODULE_NS].selectedToken;
      },
      urn() {
        return this.$store.getters[`${MODULE_NS}/urn`];
      },
      tokens() {
        const selectedFilter = edge => {
          // FIXME: This should only be a veRef check,
          // but words have no veRefs, and we now set selected
          // token using word.
          return (
            this.selectedToken === null ||
            this.selectedToken.veRef === edge.node.veRef ||
            this.selectedToken.value === edge.node.wordValue
          );
        };

        // FIXME: Add unit tests; we lost functionality in WordListWidget
        // due to the refactor to token annotations
        if (this.lines && this.lines.length > 0) {
          const tokens = this.lines
            .map(line => {
              const { edges } = line.tokens;
              return edges
                .filter(selectedFilter)
                .map(edge => {
                  const token = edge.node;
                  // TODO: Improve encapsulation of additional annotation data
                  const firstAnnotationEdge =
                    token.annotations.edges.slice(0, 1)[0] || null;
                  const annotationData = firstAnnotationEdge
                    ? firstAnnotationEdge.node.data
                    : {};
                  const { lemma, tag } = annotationData;

                  return {
                    veRef: token.veRef,
                    value: token.wordValue,
                    lemma,
                    tag,
                  };
                })
                .filter(token => token.tag);
            })
            .flat();
          return [...new Set(tokens)];
        }
        return [];
      },
    },
    apollo: {
      lines: {
        query: gql`
          query Annotations($urn: String!) {
            passageTextParts(reference: $urn) {
              edges {
                node {
                  id
                  ref
                  tokens {
                    edges {
                      node {
                        id
                        veRef
                        wordValue
                        annotations(first: 1) {
                          edges {
                            node {
                              collection {
                                urn
                              }
                              data
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        variables() {
          return { urn: this.urn.absolute };
        },
        update(data) {
          return data.passageTextParts.edges.map(line => line.node);
        },
        skip() {
          return this.urn === null;
        },
      },
    },
    watch: {
      // FIXME: This helps us to restitch selected lemma into selected word
      selectedToken(newValue) {
        if (
          newValue &&
          !newValue.lemma &&
          this.tokens[0].veRef === newValue.veRef
        ) {
          const token = {
            ...newValue,
            lemma: this.tokens[0].lemma,
          };
          this.$store.dispatch(`${MODULE_NS}/${SELECT_TOKEN}`, { token });
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .selected-tokens {
    margin: 0 2rem;
    color: var(--sv-widget-token-annotations-selected-text-color, #495057);
    font-size: 12px;
    width: calc(100% - 4rem);
    td {
      padding-left: 1em;
    }
    th {
      text-align: left;
    }

    .parse {
      font-family: monospace;
      color: var(
        --sv-widget-token-annotations-selected-parse-text-color,
        #343a40
      );
    }
  }
</style>
