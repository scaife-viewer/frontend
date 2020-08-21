<template>
  <div class="passage-reference-widget u-widget">
    <div class="healed" v-if="healed">
      Passage reference <strong>{{ requested }}</strong> could not be resolved.
      Instead, we are showing you <strong>{{ healed }}</strong>.
    </div>
    <div class="human" v-if="human">{{ human }}</div>
    <input
      v-model="reference"
      v-on:keyup="handleEnter"
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
    },
    data() {
      return {
        reference: '',
        requested: '',
        healed: '',
        human: '',
      };
    },
    methods: {
      setInputRef() {
        if (this.passage) {
          this.reference = this.passage.reference;
          this.fetchData();
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
            this.human = humanReference;
            this.requested = this.reference;
            if (healedPassage) {
              // eslint-disable-next-line prefer-destructuring
              this.healed = new URN(healedPassage).reference;
            } else {
              this.healed = '';
            }
            const ref = healedPassage || urn;
            if (ref !== this.$route.query.urn) {
              this.$router.push({ to: 'reader', query: { urn: ref } });
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
    }

    .healed {
       color: var(--sv-passage-reference-healed-text-color, #B45141);
       border: 1px solid var(--sv-passage-reference-healed-border-color, #D9A8A0);
       padding: 0.5rem 0.75rem;
       font-size: 80%;
    }
    .human {
      margin: 0.5rem 0;
    }
  }
</style>
