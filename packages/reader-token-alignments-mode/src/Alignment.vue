<template>
  <div class="alignment">
    <div class="line" v-for="line in content" :key="line.ref">
      <div class="alignment-ref">{{ line.ref }}</div>
      <div class="tokens" :class="[`text-${textSize}`, `text-width-${textWidth}`]">
        <template v-for="token in line.tokens">
          <span :key="token.id" class="token" :class="{ selected: selected(token) }" @mouseenter="onTokenEnter(token)" @mouseleave="onTokenExit">
            <span class="word-value">
              {{ token.wordValue }}
            </span>
            <span class="alignments-container" v-if="false">
              <span
                v-for="(alignment, index) in token.tokenAlignments"
                :key="`${token.id}-${index}`"
                :class="`a${index}`"
                @mouseover="onHover(alignment)"
              >&#x2B24;</span>
            </span>
          </span>{{ ' ' }}
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['content', 'hoveringOn', 'textSize', 'textWidth'],
    data() {
      return {
        hoveringToken: null,
      };
    },
    methods: {
      selected(token) {
        return token.id === this.hoveringToken || this.hoveringOn.indexOf(token.id) > -1
      },
      onHover(alignment) {
        this.$emit('hovered', alignment);
      },
      onTokenEnter(token) {
        this.hoveringToken = token.id;
        this.$emit('hovered', token.tokenAlignments[0] || []);
      },
      onTokenExit() {
        this.hoveringToken = null;
        this.$emit('hovered', []);
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

  .token:hover > .alignments-container {
    display: block;
    opacity: 1;
  }
  .token {
    display: inline-block;
  }
  .token.selected {
    color: var(--sv-reader-token-alignments-mode-selected-text-color, #F00);
  }
  .alignments-container {
    font-size: 10pt;
    display: block;
    opacity: 0;
    color: transparent;
    cursor: pointer;

    .a0 {
      color: var(--sv-reader-token-alignments-mode-a0-text-color, #F00);
    }
    .a1 {
      color: var(--sv-reader-token-alignments-mode-a1-text-color, #0C0);
    }
    .a2 {
      color: var(--sv-reader-token-alignments-mode-a2-text-color, #00F);
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
