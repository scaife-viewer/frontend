<template>
  <div class="alignments">
    <Alignment ref="left" :content="leftContent" :textSize="textSize" :textWidth="textWidth" />
    <Alignment ref="right" :content="rightContent" :textSize="textSize" :textWidth="textWidth" />
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
  const shapeContent = (lines, alignments) => {
    return lines && lines.map(line => {
      const tokens = line.tokens.map(t => {
        let tokenAlignments = [];
        alignments.forEach(relation => {
          const [left, right] = relation;
          left.forEach(token => {
            if (token.id === t.id && right) {
              tokenAlignments = right.map(t => t.id);
            }
          });
          right && right.forEach(token => {
            if (token.id === t.id) {
              tokenAlignments = left.map(t => t.id);
            }
          });
        });
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
    props: ['alignments', 'references', 'textSize', 'textWidth'],
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
    computed: {
      leftContent() {
        return shapeContent(this.left, this.alignments);
      },
      rightContent() {
        return shapeContent(this.right, this.alignments);
      },
    }
  };
</script>

<style lang="scss" scoped>
  .alignments {
    display: flex;
  }
</style>
