<template>
  <div class="alignments">
    <TextPartTokenAlignment
      :reference="firstRef"
      :content="first"
      :tokenMap="tokenMap"
      :recordMap="recordMap"
      :hoveringAt="hoveredIndex"
      :hoveringOn="hoveredAlignmentTokens"
      :textSize="textSize"
      :textWidth="textWidth"
      :direction="textDirection(firstRef.reference)"
      @hovered="onHover"
    />
    <TextPartTokenAlignment
      :reference="secondRef"
      :content="second"
      :tokenMap="tokenMap"
      :recordMap="recordMap"
      :hoveringAt="hoveredIndex"
      :hoveringOn="hoveredAlignmentTokens"
      :textSize="textSize"
      :textWidth="textWidth"
      @hovered="onHover"
    />
    <TextPartTokenAlignment
      v-if="thirdVersionHasContent"
      :reference="thirdRef"
      :content="third"
      :tokenMap="tokenMap"
      :recordMap="recordMap"
      :hoveringAt="hoveredIndex"
      :hoveringOn="hoveredAlignmentTokens"
      :textSize="textSize"
      :textWidth="textWidth"
      @hovered="onHover"
    />
    <EmptyMessage v-else-if="hasThirdVersion" class="empty-version">
      No records linking "{{ firstRef.versionUrn }}" and "{{
        thirdRef.versionUrn
      }}" were found.
    </EmptyMessage>
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import { EmptyMessage } from '@scaife-viewer/common';

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
    components: { EmptyMessage, TextPartTokenAlignment },
    computed: {
      versionsCount() {
        return this.data.references.length;
      },
      hasThirdVersion() {
        return this.versionsCount >= 3;
      },
      thirdVersionHasContent() {
        return this.hasThirdVersion ? this.thirdRef.tokenCount : false;
      },
      firstRef() {
        return this.data.references[0];
      },
      secondRef() {
        return this.data.references[1];
      },
      thirdRef() {
        return this.data.references[2];
      },
      tokenMap() {
        return this.data.tokenMap;
      },
      recordMap() {
        return this.data.recordMap;
      },
    },
    apollo: {
      first: {
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
      second: {
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
      // TODO: Refactor support an arbitrary number of texts
      third: {
        query: passageQuery,
        variables() {
          return {
            reference: this.data.references[2].reference,
          };
        },
        update(data) {
          return passageUpdate(data);
        },
        skip() {
          return !this.thirdVersionHasContent;
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
  .empty-version {
    margin-left: 2.0em;
    margin-right: -2.0em;
  }
</style>
