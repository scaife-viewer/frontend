<template>
  <div class="alignments">
    <TextAlignment :reference="leftRef" :content="left" :textSize="textSize" :textWidth="textWidth" :tokenMap="tokenMap" :recordMap="recordMap" :hoveringAt="hoveredIndex" :hoveringOn="hoveredAlignmentTokens" @hovered="onHover" />
    <TextAlignment :reference="rightRef" :content="right" :textSize="textSize" :textWidth="textWidth" :tokenMap="tokenMap" :recordMap="recordMap" :hoveringAt="hoveredIndex" :hoveringOn="hoveredAlignmentTokens" @hovered="onHover" />
  </div>
</template>

<script>
  import gql from 'graphql-tag';

  import TextAlignment from './TextAlignment.vue';

  const passageQuery = gql`query Passage($reference: String!) {
    passageTextParts(reference: $reference) {
      edges {
        node {
          ref
          id
          tokens {
            edges {
              node {
                id
                idx
                wordValue
              }
            }
          }
        }
      }
    }
  }`;
  const passageUpdate = data => data.passageTextParts.edges.map(e => {
    return {
      ref: e.node.ref,
      tokens: e.node.tokens.edges.map(te => te.node),
    }
  });

  export default {
    props: ['tokenMap', 'recordMap', 'references', 'textSize', 'textWidth'],
    components: { TextAlignment },
    computed: {
      leftRef() {
        return this.references[0];
      },
      rightRef() {
        return this.references[1];
      },
    },
    apollo: {
      left: {
        query: passageQuery,
        variables() {
          return {
            reference: this.references[0].reference,
          }
        },
        update(data) {
          return passageUpdate(data);
        },
      },
      right: {
        query: passageQuery,
        variables() {
          return {
            reference: this.references[1].reference,
          }
        },
        update(data) {
          return passageUpdate(data);
        },
      },
    },
    data() {
      return {
        hoveredIndex: 0,
        hoveredAlignmentTokens: [],
      };
    },
    methods: {
      onHover(alignmentTokens, number) {
        this.hoveredIndex = number || 0;
        this.hoveredAlignmentTokens = alignmentTokens;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .alignments {
    display: flex;
    justify-content: center;
  }
</style>
