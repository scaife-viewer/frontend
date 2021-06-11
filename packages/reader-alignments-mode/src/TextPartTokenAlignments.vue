<template>
  <div class="alignments">
    <TextPartTokenAlignment
      :reference="leftRef"
      :content="left"
      :tokenMap="tokenMap"
      :recordMap="recordMap"
      :hoveringAt="hoveredIndex"
      :hoveringOn="hoveredAlignmentTokens"
      :textSize="textSize"
      :textWidth="textWidth"
      :direction="textDirection(leftRef.reference)"
      @hovered="onHover"
    />
    <TextPartTokenAlignment
      :reference="rightRef"
      :content="right"
      :tokenMap="tokenMap"
      :recordMap="recordMap"
      :hoveringAt="hoveredIndex"
      :hoveringOn="hoveredAlignmentTokens"
      :textSize="textSize"
      :textWidth="textWidth"
      @hovered="onHover"
    />
  </div>
</template>

<script>
  import gql from 'graphql-tag';

  import TextPartTokenAlignment from './TextPartTokenAlignment.vue';

  const passageQuery = gql`
    query Passage($reference: String!) {
      passageTextParts(reference: $reference) {
        edges {
          node {
            id
            ref
            tokens {
              edges {
                node {
                  id
                  idx
                  value
                }
              }
            }
          }
        }
      }
    }
  `;
  const passageUpdate = data =>
    data.passageTextParts.edges.map(e => {
      return {
        id: e.node.id,
        ref: e.node.ref,
        tokens: e.node.tokens.edges.map(te => te.node),
      };
    });

  export default {
    props: ['data', 'textSize', 'textWidth'],
    components: { TextPartTokenAlignment },
    computed: {
      leftRef() {
        return this.data.references[0];
      },
      rightRef() {
        return this.data.references[1];
      },
      tokenMap() {
        return this.data.tokenMap;
      },
      recordMap() {
        return this.data.recordMap;
      },
    },
    apollo: {
      left: {
        query: passageQuery,
        variables() {
          return {
            reference: this.data.references[0].reference,
          };
        },
        update(data) {
          return passageUpdate(data);
        },
      },
      right: {
        query: passageQuery,
        variables() {
          return {
            reference: this.data.references[1].reference,
          };
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
      textDirection(urn) {
        // FIXME: Pass directionality as a display hint or deduce from
        // version metadata
        return urn.indexOf('perseus-far') > -1 ? 'rtl' : '';
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
