<template>
  <svg @click.prevent="$emit('pressed')" class="play-button" :height="height" :width="width">
    <circle
      class="ring"
      :stroke-width="strokeWidth"
      :r="radius"
      :cx="cx"
      :cy="cy"
      :style="{ strokeDasharray: `${circumference} ${circumference}`, strokeDashoffset: offset}"
    >
      <g v-if="playing">
        <path d="M169.875 378.5625 L133.875 378.5625 L133.875 198.5625 L169.875 198.5625 L169.875 378.5625 ZM97.875 378.5625 L61.875 378.5625 L61.875 198.5625 L97.875 198.5625 L97.875 378.5625 Z" stroke="none"/>
      </g>
      <g v-else>
        <path d="M154.4062 277.875 L39.2344 338.625 L39.2344 217.125 L154.4062 277.875 Z" stroke="none"/>
      </g>
    </circle>
  </svg>
</template>

<script>
  const WIDTH = 50;
  const STROKE = 5;
  export default {
    props: ['playing', 'progress'],
    computed: {
      width() {
        return WIDTH;
      },
      height() {
        return WIDTH;
      },
      strokeWidth() {
        return STROKE;
      },
      cx() {
        return this.width / 2;
      },
      cy() {
        return this.width / 2;
      },
      radius() {
        return (this.width / 2) - (this.strokeWidth * 2);
      },
      circumference() {
        return this.radius * 2 * Math.PI;
      },
      offset() {
        return this.circumference - (this.progress * this.circumference);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .ring {
    stroke: var(--sv-audio-widget-play-button-progress-color, #00A);
    fill: var(--sv-audio-widget-play-button-fill-color, #EEE);
    transition: stroke-dashoffset 0.35s;
    transform: rotate(-90deg);
    transform-origin: 50% 50%,
  }
</style>
