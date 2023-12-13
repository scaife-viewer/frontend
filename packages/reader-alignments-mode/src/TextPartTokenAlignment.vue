<template>
  <div :class="['text-alignment', direction]">
    <div
      class="line"
      v-for="line in content"
      :key="line.id"
      :class="{ 'half-line-end': isHalfLineEnd(line) }"
    >
      <div
        class="text-alignment-ref"
        @mouseenter="onLineEnter(line)"
        @mouseleave="onLineExit"
      >
        {{ line.ref }}
      </div>
      <div
        class="tokens"
        :class="[`text-${textSize}`, `text-width-${textWidth}`]"
      >
        <template v-for="token in line.tokens">
          <span
            :key="token.id"
            class="token"
            :class="[
              { selected: selected(token), empty: emptyAlignments(token) },
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
          >{{ token.spaceAfter ? ' ' : '' }}</template
        >
      </div>
    </div>
  </div>
</template>

<script>
  import AlignmentRecordPicker from './AlignmentRecordPicker.vue';

  export default {
    props: [
      'reference',
      'content',
      'hoveringAt',
      'hoveringOn',
      'textSize',
      'textWidth',
      'tokenMap',
      'recordMap',
      'direction',
    ],
    components: { AlignmentRecordPicker },
    methods: {
      emptyAlignments(token) {
        const { startIdx, endIdx } = this.reference;
        return token.idx < startIdx || token.idx > endIdx;
      },
      recordsForToken(token) {
        const records = this.tokenMap[token.id] || [];
        return records.length > 1 ? records : [];
      },
      selected(token) {
        return this.hoveringOn.indexOf(token.id) > -1;
      },
      onPickerHover(recordId, number) {
        if (recordId && this.recordMap[recordId]) {
          this.$emit('hovered', this.recordMap[recordId], number);
        }
      },
      onLineEnter(line) {
        const records = line.tokens.reduce((arr, token) => {
          return [...arr, ...(this.tokenMap[token.id] || [])];
        }, []);
        const hovering = records.reduce((arr, record) => {
          return [...arr, ...(this.recordMap[record] || [])];
        }, []);
        this.$emit('hovered', hovering, 0);
      },
      onLineExit() {
        this.$emit('hovered', [], null);
      },
      onTokenEnter(token) {
        // fix to only a single alignment for now
        const recordId = this.tokenMap[token.id] && this.tokenMap[token.id][0];
        if (recordId) {
          const hovering = this.recordMap[recordId];
          this.$emit('hovered', hovering || [], 0);
        }
      },
      onTokenExit() {
        this.$emit('hovered', [], null);
      },
      isHalfLineEnd(textPart) {
        const refDepth = (textPart.ref.match(/\./g) || []).length;
        return refDepth === 3 ? textPart.ref.endsWith('2') : false;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .text-alignment {
    margin-bottom: 20px;
    flex: 1;
  }
  .text-alignment.rtl {
    direction: rtl;
    padding-inline-start: 1rem;
    // FIXME: Proper rtl font support, including Amiri note below
    .line {
      font-family: var(
        --sv-alignments-line-font-family-rtl,
        'Amiri',
        'Noto Sans'
      );
    }
    .text-md {
      font-size: 24px;
      line-height: 1.7;
    }
  }
  .text-alignment-ref {
    text-align: center;
    font-size: 12pt;
    color: var(--sv-alignments-alignment-ref-text-color, #69c);
    font-family: var(--sv-alignments-alignment-ref-font-family, 'Noto Sans');
    margin-bottom: 5px;
    padding-inline-end: 0.5rem;
  }
  .line {
    display: flex;
    font-family: var(--sv-alignments-line-font-family, 'Noto Serif');
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
  .token.empty {
    color: var(--sv-alignments-token-no-alignments-text-color, #ccc);
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
