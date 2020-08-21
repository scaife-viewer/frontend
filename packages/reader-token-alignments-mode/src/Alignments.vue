<template>
  <div class="alignments">
    <Alignment ref="left" :content="leftContent" :textSize="textSize" :textWidth="textWidth" :hoveringOn="hoveredAlignmentTokens" @hovered="onHover" />
    <Alignment ref="right" :content="rightContent" :textSize="textSize" :textWidth="textWidth" :hoveringOn="hoveredAlignmentTokens" @hovered="onHover" />
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
  const shapeContent = (lines, alignmentMap) => {
    return lines && lines.map(line => {
      const tokens = line.tokens.map(t => {
        const tokenAlignments = alignmentMap[t.id] || [];
        return {
          id: t.id,
          wordValue: t.wordValue,
          tokenAlignments,
        };
      });
      return {
        ...line,
        tokens,
      };
    });
  };

  export default {
    props: ['alignmentMap', 'references', 'textSize', 'textWidth'],
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
        hoveredAlignmentTokens: [],
      };
    },
    methods: {
      onHover(alignmentTokens) {
        this.hoveredAlignmentTokens = alignmentTokens;
      },
    },
    computed: {
      leftContent() {
        return shapeContent(this.left, this.alignmentMap);
      },
      rightContent() {
        return shapeContent(this.right, this.alignmentMap);
      },
    }
  };
</script>

<style lang="scss" scoped>
  .alignments {
    display: flex;
  }
</style>
