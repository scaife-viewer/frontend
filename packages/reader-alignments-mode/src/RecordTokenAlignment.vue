<template>
  <div class="alignment">
    <div class="alignment-ref">{{ label }}</div>
    <div class="columns">
      <div :class="['left', `text-${textSize}`, `text-width-${textWidth}`]">
        <div v-for="line in left" :key="line[0]" :class="['line', line[2]]">
          <span class="line-ref">{{ line[0] }}</span>
          <span class="line-text">{{ line[1] }}</span>
        </div>
      </div>
      <div :class="['right', `text-${textSize}`, `text-width-${textWidth}`]">
        <div v-for="line in right" :key="line[0]" :class="['line', line[2]]">
          {{ line[1] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['record', 'textSize', 'textWidth'],
    methods: {
      initLine() {
        return {
          ref: null,
          values: [],
        };
      },
      extractLines(relation) {
        const lines = [];
        let lastSeenRef = null;
        let line = this.initLine();
        relation.tokens.forEach(token => {
          const textPartRef = token.veRef
            .split('.')
            .slice(0, -1)
            .join('.');
          if (lastSeenRef !== textPartRef && line.values.length > 0) {
            lines.push(line);
            line = this.initLine();
          }
          lastSeenRef = textPartRef;
          line.ref = textPartRef;
          line.values.push(token.value);
        });
        if (line.values.length > 0) {
          lines.push(line);
        }
        return lines.map(l => {
          return [
            l.ref,
            l.values.join(' '),
            '', // TODO: continuation data
          ];
        });
      },
    },
    computed: {
      label() {
        return this.record.label;
      },
      left() {
        return this.extractLines(this.record.relations[0]);
      },
      right() {
        return this.extractLines(this.record.relations[1]);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .alignment {
    margin-bottom: 20px;
    .columns {
      display: flex;
      justify-content: center;
      .left,
      .right {
        flex: 1;
      }
      .left {
        padding-right: 0.5rem;
      }
      .right {
        padding-left: 0.5rem;
        padding-right: 0.25rem;
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
  .left .line {
    display: flex;
    align-items: baseline;
    .line-ref {
      font-size: 10pt;
      color: var(--sv-alignments-line-ref-text-color, #69c);
      font-family: 'Noto Sans';
      min-width: 4em;
      text-align: right;
    }
    .line-text {
      margin-left: 1rem;
    }
  }
  .line {
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
