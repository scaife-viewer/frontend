<template>
  <div class="passage-reference-widget">
    <div class="healed" v-if="healedUrn">
      Passage reference <strong>{{ requestedUrn.reference }}</strong> could not
      be resolved. Instead, we are showing you
      <strong>{{ healedUrn.reference }}</strong
      >.
    </div>
    <div class="human" v-if="humanRef">{{ humanRef }}</div>
    <input
      v-model="reference"
      v-on:keyup.enter="handleEnter"
      v-on:click="handleClick"
      type="text"
      class="form-control form-control-sm"
    />
  </div>
</template>

<script>
  import gql from 'graphql-tag';

  import URN from '@scaife-viewer/common';
  import { MODULE_NS } from '@scaife-viewer/store';

  export default {
    name: 'PassageReferenceWidget',
    scaifeConfig: {
      displayName: 'Passage Reference',
    },
    watch: {
      passage: {
        handler: 'setInputRef',
        immediate: true,
      },
    },
    computed: {
      firstPassageUrn() {
        return this.$store.getters[`${MODULE_NS}/firstPassageUrn`];
      },
      passage() {
        return this.$store.getters[`${MODULE_NS}/passage`];
      },
      preferredUrn() {
        return this.healedUrn || this.requestedUrn;
      },
    },
    data() {
      return {
        reference: '',
        requestedUrn: null,
        healedUrn: null,
        humanRef: '',
      };
    },
    methods: {
      shouldFetchData() {
        if (!this.preferredUrn) {
          return true;
        }
        return this.passage.absolute != this.preferredUrn.absolute;
      },
      setInputRef() {
        if (this.passage) {
          this.reference = this.passage.reference;
          if (this.shouldFetchData()) {
            this.fetchData();
          }
        }
      },
      fetchData() {
        const urn = `${this.passage.version}${this.reference}`;
        this.$apollo
          .query({
            query: gql`
              query ValidateReference($urn: String!) {
                passageTextParts(reference: $urn) {
                  metadata {
                    healedPassage
                    humanReference
                  }
                }
              }
            `,
            variables: { urn },
            skip: this.reference === '',
          })
          .then(data => {
            const {
              healedPassage,
              humanReference,
            } = data.data.passageTextParts.metadata;
            this.requestedUrn = new URN(urn);

            this.humanRef = humanReference;
            if (healedPassage) {
              this.healedUrn = new URN(healedPassage);
              this.reference = this.healedUrn.reference;
            } else {
              this.healedUrn = null;
              this.reference = this.requestedUrn.reference;
            }

            if (this.preferredUrn.absolute !== this.$route.params.urn) {
              this.$router.push({
                to: 'reader',
                params: { urn: this.preferredUrn.absolute },
                query: this.$route.query,
              });
            }
          });
      },
      handleEnter() {
        this.fetchData();
      },
      handleClick(e) {
        const el = e.currentTarget;
        el.select();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .passage-reference-widget {
    flex: 1;
    overflow-y: unset;
    input {
      box-sizing: border-box;
      outline: none;
      width: 100%;
      font-size: 12pt;
      padding: 0.375rem 0.5rem;
      border-radius: 4px;
      border: 1px solid var(--sv-passage-reference-border-color, #ccc);
    }

    .healed {
      color: var(--sv-passage-reference-healed-text-color, #b45141);
      border: 1px solid var(--sv-passage-reference-healed-border-color, #d9a8a0);
      padding: 0.5rem 0.75rem;
      font-size: 80%;
    }
    .human {
      margin: 0.5rem 0;
    }
  }
</style>
