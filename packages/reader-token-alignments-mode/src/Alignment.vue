<template>
  <div class="alignment">
    <div class="line" v-for="line in content" :key="line.ref">
      <div class="alignment-ref">{{ line.ref }}</div>
      <div class="tokens" :class="[`text-${textSize}`, `text-width-${textWidth}`]">
          <span v-for="token in line.tokens" :key="token.id" class="token">
            {{ token.wordValue }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['content', 'alignments', 'textSize', 'textWidth'],
    computed: {

    }
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
