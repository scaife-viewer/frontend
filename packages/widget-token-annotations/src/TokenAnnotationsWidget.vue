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
  import { MODULE_NS, CLEAR_TOKEN } from '@scaife-viewer/store';

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
          return (
            this.selectedToken === null ||
            this.selectedToken.veRef === edge.node.veRef
          );
        };

        if (this.lines && this.lines.length > 0) {
          const tokens = this.lines
            .map(line => {
              const { edges } = line.tokens;
              return edges
                .filter(selectedFilter)
                .map(edge => {
                  const token = edge.node;
                  return {
                    veRef: token.veRef,
                    value: token.wordValue,
                    lemma: token.lemma,
                    tag: token.tag,
                  };
                })
                .filter(token => token.tag !== null);
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
                        lemma
                        tag
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
      color: var(--sv-widget-token-annotations-selected-parse-text-color, #343a40);
    }
  }
</style>
