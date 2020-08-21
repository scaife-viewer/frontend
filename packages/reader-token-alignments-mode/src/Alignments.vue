<template>
  <div class="alignments">
    <Alignment ref="left" :content="left" :textSize="textSize" :textWidth="textWidth" :tokenMap="tokenMap" :chunkMap="chunkMap" :hoveringAt="hoveredIndex" :hoveringOn="hoveredAlignmentTokens" @hovered="onHover" />
    <Alignment ref="right" :content="right" :textSize="textSize" :textWidth="textWidth" :tokenMap="tokenMap" :chunkMap="chunkMap" :hoveringAt="hoveredIndex" :hoveringOn="hoveredAlignmentTokens" @hovered="onHover" />
  </div>
</template>

<script>
  import gql from 'graphql-tag';

  import Alignment from './Alignment.vue';

  const passageQuery = gql`query Passage($reference: String!) {
    passageTextParts(reference: $reference) {
      edges {
        node {
          ref
          tokens {
            edges {
              node {
                id
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
    props: ['tokenMap', 'chunkMap', 'references', 'textSize', 'textWidth'],
    components: { Alignment },
    apollo: {
      left: {
        query: passageQuery,
        variables() {
          return {
            reference: this.references[0],
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
            reference: this.references[1],
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
  }
</style>
