<template>
  <div class="alignments">
    <div v-if="groupedPassages.length > 0">
      <div
        v-for="(row, rowIdx) in groupedPassages"
        :key="passageKey(rowIdx)"
        class="alignment row text-alignment"
        :class="{ 'half-line': isHalfLineEnd(row[0]) }"
      >
        <div v-if="false" class="alignment-ref">{{ passageKey(rowIdx) }}</div>
        <div class="columns">
          <div
            v-for="(line, lineIdx) in row"
            :key="line.id"
            :class="{
              left: lineIdx == 0,
              right: lineIdx == 1,
              other: lineIdx == 2,
              'half-line-end': isHalfLineEnd(line),
              rtl: textDirection(data.references[lineIdx].reference) == 'rtl',
            }"
            class="line"
          >
            <span
              class="text-alignment-ref-line-ref"
              @mouseenter="onLineEnter(line)"
              @mouseleave="onLineExit"
            >
              {{ line.ref }}
            </span>
            <span
              class="line-text tokens"
              :class="[`text-${textSize}`, `text-width-${textWidth}`]"
            >
              <template v-for="token in line.tokens">
                <span
                  :key="token.id"
                  class="token"
                  :class="[
                    {
                      selected: selected(token),
                      'is-unaligned': highlightUnaligned && isUnaligned(token),
                      'out-of-bounds': outOfBounds(token, lineIdx),
                    },
                    `a${hoveringAt}`,
                  ]"
                  @mouseenter="onTokenEnter(token)"
                  @mouseleave="onTokenExit"
                >
                  <span class="value">
                    {{ token.value }}
                  </span>
                  <AlignmentRecordPicker
                    :records="recordsForToken(token)"
                    @hovered="onPickerHover"
                  /> </span
                >{{ ' ' }}
              </template>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // HACK: This entire component has been sliced and diced from the other two
  // components; needs to be revisited ASAP.

  import gql from 'graphql-tag';

  import AlignmentRecordPicker from './AlignmentRecordPicker.vue';

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
    props: ['data', 'textSize', 'textWidth', 'highlightUnaligned'],
    components: { AlignmentRecordPicker },
    computed: {
      hoveringOn() {
        return this.hoveredAlignmentTokens;
      },
      hoveringAt() {
        return this.hoveredIndex;
      },
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
      groupedPassages() {
        // HACK: Experimenting for three-alignments
        const regrouped = [];
        if (!this.first) {
          return regrouped;
        }
        if (this.second && this.third) {
          this.first.forEach(function callbackFn(textPart, i) {
            regrouped.push([textPart, this.second[i], this.third[i]]);
          }, this);
        } else if (this.second) {
          this.first.forEach(function callbackFn(textPart, i) {
            regrouped.push([textPart, this.second[i]]);
          }, this);
        }
        return regrouped;
      },
    },
    apollo: {
      // TODO: Use a memoized query to get enough data to resolve
      // this.textDirection
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
      isUnaligned(token) {
        return this.tokenMap[token.id] === undefined;
      },
      outOfBounds(token, refIdx) {
        const reference = this.data.references[refIdx];
        const { startIdx, endIdx } = reference;
        return token.idx < startIdx || token.idx > endIdx;
      },
      recordsForToken(token) {
        const records = this.tokenMap[token.id] || [];
        return records.length > 1 ? records : [];
      },
      onHover(alignmentTokens, number) {
        this.hoveredIndex = number || 0;
        this.hoveredAlignmentTokens = alignmentTokens;
      },
      hovered(alignmentTokens, number) {
        this.onHover(alignmentTokens, number);
      },
      textDirection(urn) {
        // FIXME: Pass directionality as a display hint or deduce from
        // version metadata
        const isFarsi =
          urn.indexOf('perseus-far') > -1 || urn.indexOf('shamsian-far') > -1;
        return isFarsi ? 'rtl' : '';
      },
      passageKey(idx) {
        // TODO: Better key
        return this.first[idx].ref;
      },
      onLineEnter(line) {
        const records = line.tokens.reduce((arr, token) => {
          return [...arr, ...(this.tokenMap[token.id] || [])];
        }, []);
        const hovering = records.reduce((arr, record) => {
          return [...arr, ...(this.recordMap[record] || [])];
        }, []);
        // this.$emit('hovered', hovering, 0);
        this.hovered(hovering, 0);
      },
      onLineExit() {
        // this.$emit('hovered', [], null);
        this.hovered([], null);
      },
      onTokenEnter(token) {
        // fix to only a single alignment for now
        const recordId = this.tokenMap[token.id] && this.tokenMap[token.id][0];
        if (recordId) {
          const hovering = this.recordMap[recordId];
          this.hovered(hovering || [], 0);
          // this.$emit('hovered', hovering || [], 0);
        }
      },
      onTokenExit() {
        this.hovered([], null);
        // this.$emit('hovered', [], null);
      },

      isHalfLineEnd(textPart) {
        const refDepth = (textPart.ref.match(/\./g) || []).length;
        return refDepth === 3 ? textPart.ref.endsWith('2') : false;
      },
      selected(token) {
        return this.hoveringOn.indexOf(token.id) > -1;
      },
      onPickerHover(recordId, number) {
        if (recordId && this.recordMap[recordId]) {
          // this.$emit('hovered', this.recordMap[recordId], number);
          this.hovered(this.recordMap[recordId], number);
        }
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
    margin-left: 2em;
    margin-right: -2em;
  }
  .alignment {
    margin-bottom: 20px;
    .columns {
      display: flex;
      justify-content: center;
      .left,
      .right,
      .other {
        flex: 1;
      }
      .left {
        padding-right: 0.5rem;
      }
      .right {
        padding-left: 0.5rem;
        padding-right: 0.25rem;
      }
      .other {
      }
    }
  }
  .line.rtl {
    direction: rtl;
    padding-inline-start: 1rem;
    font-family: var(
      --sv-alignments-line-font-family-rtl,
      'Amiri',
      'Noto Sans'
    );
    .text-md {
      font-size: 24px;
      line-height: 1.7;
    }
    .text-alignment-ref-line-ref {
      direction: ltr;
      padding-inline-start: 0.5rem;
    }
  }

  .text-alignment {
    margin-bottom: 1.25em;
    flex: 1;
  }
  .text-alignment.half-line {
    margin-top: -1.25em;
  }

  .text-alignment-ref-line-ref {
    text-align: center;
    // font-size: 12pt;
    // color: var(--sv-alignments-alignment-ref-text-color, #69c);
    // HACK: Experimenting for three-alignments
    font-size: 8pt;
    color: var(--sv-alignments-alignment-ref-text-color, #6699ccaf);
    font-family: var(
      --sv-alignments-ref-alignment-ref-font-family,
      'Noto Sans'
    );
    margin-bottom: 5px;
    padding-inline-end: 0.5rem;
  }
  .half-line-end {
    .tokens {
      margin-inline-start: 5%;
      margin-block-end: 10px;
    }
  }
  .token:hover > ::v-deep.alignment-records-picker {
    opacity: 1;
  }
  .token.is-unaligned {
    color: var(--sv-alignments-token-no-alignments-text-color, #f06e6e);
  }
  .token.out-of-bounds {
    color: var(--sv-alignments-token-out-of-bounds-text-color, #ccc);
  }
  .token {
    display: inline-block;
  }
  .token.selected {
    &.a0 {
      color: var(
        --sv-reader-token-alignments-mode-alignment-record-a0-color,
        #f00
      );
    }
    &.a1 {
      color: var(
        --sv-reader-token-alignments-mode-alignment-record-a1-color,
        #0c0
      );
    }
    &.a2 {
      color: var(
        --sv-reader-token-alignments-mode-alignment-record-a2-color,
        #00f
      );
    }
    background: var(
      --sv-reader-token-alignments-mode-highlight-background-color,
      #fea
    );
  }
  .alignment-ref {
    text-align: center;
    font-size: 12pt;
    color: var(--sv-alignments-alignment-ref-text-color, #69c);
    font-family: var(--sv-alignments-alignment-ref-font-family, 'Noto Sans');
    margin-bottom: 5px;
  }
  .left .line {
    display: flex;
    align-items: baseline;
    .line-ref {
      font-size: 10pt;
      color: var(--sv-alignments-line-ref-text-color, #69c);
      font-family: var(--sv-alignments-line-ref-font-family, 'Noto Sans');
      min-width: 4em;
      text-align: right;
    }
    .line-text {
      margin-left: 1rem;
    }
  }
  .line {
    display: flex;
    font-family: var(--sv-alignments-line-font-family, 'Noto Serif');
  }

  .text-xs .line {
    line-height: 1.5;
  }
  .text-sm .line {
    line-height: 1.6;
  }
  .text-md .line {
    line-height: 1.7;
  }
  .text-lg .line {
    line-height: 1.8;
  }
  .text-xl .line {
    line-height: 1.9;
  }
  .text-xs {
    font-size: 12px;
  }
  .text-sm {
    font-size: 14px;
  }
  .text-md {
    font-size: 16px;
  }
  .text-lg {
    font-size: 20px;
  }
  .text-xl {
    font-size: 24px;
  }

  // TODO: media queries for defaults?
  .text-width-narrow {
    max-width: 20em;
  }

  .text-width-normal {
    max-width: 30em;
  }

  .text-width-wide {
    max-width: 40em;
  }

  .text-width-full {
    max-width: 100%;
  }
</style>
