<template>
  <div class="alignment">
    <div class="line" v-for="line in content" :key="line.ref">
      <div class="alignment-ref">{{ line.ref }}</div>
      <div class="tokens" :class="[`text-${textSize}`, `text-width-${textWidth}`]">
        <template v-for="token in line.tokens">
          <span :key="token.id" class="token" :class="[{ selected: selected(token) }, `a${hoveringAt}`]" @mouseenter="onTokenEnter(token)" @mouseleave="onTokenExit">
            <span class="word-value">
              {{ token.wordValue }}
            </span>
            <AlignmentPicker :chunks="tokenMap[token.id]" @hovered="onPickerHover" />
          </span>{{ ' ' }}
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import AlignmentPicker from './AlignmentPicker.vue';

  export default {
    props: ['content', 'hoveringAt', 'hoveringOn', 'textSize', 'textWidth', 'tokenMap', 'chunkMap'],
    components: { AlignmentPicker },
    methods: {
      selected(token) {
        return this.hoveringOn.indexOf(token.id) > -1
      },
      onPickerHover(chunkId, number) {
        if (chunkId && this.chunkMap[chunkId]) {
          this.$emit('hovered', this.chunkMap[chunkId], number);
        }
      },
      onTokenEnter(token) {
        // fix to only a single alignment for now
        const chunkId = this.tokenMap[token.id] && this.tokenMap[token.id][0];
        if (chunkId) {
          const hovering = this.chunkMap[chunkId];
          this.$emit('hovered', hovering || [], 0);
        }
      },
      onTokenExit() {
        this.$emit('hovered', [], null);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .alignment {
    margin-bottom: 20px;
    .line {
      display: flex;

      .alignment-ref {
        padding-right: 0.5rem;
      }
    }
  }
  .alignment-ref {
    text-align: center;
    font-size: 12pt;
    color: var(--sv-alignments-alignment-ref-text-color, #69c);
    font-family: 'Noto Sans';
    margin-bottom: 5px;
  }
  .line {
    font-family: var(--sv-alignments-line-font-family, 'Noto Serif');
  }

  .token:hover > ::v-deep.alignments-picker {
    display: block;
    opacity: 1;
  }
  .token {
    display: inline-block;
  }
  .token.selected {
    &.a0 {
      color: var(--sv-reader-token-alignments-mode-chunk-a0-color, #F00);
    }
    &.a1 {
      color: var(--sv-reader-token-alignments-mode-chunk-a1-color, #0C0);
    }
    &.a2 {
      color: var(--sv-reader-token-alignments-mode-chunk-a2-color, #00F);
    }
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
