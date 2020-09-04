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
    </circle>
      <g v-if="playing" :transform="pauseTransform">
        <path class="pause" :d="pausePath" stroke="none" />
      </g>
      <g v-else :transform="playTransform">
        <path class="play" :d="playPath" stroke="none"/>
      </g>
  </svg>
</template>

<script>
  const WIDTH = 60;
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
      },
      pausePath() {
        const barWidth = (this.radius / 3) + 2;
        const barSpacing = this.radius - (barWidth * 2);
        const height = this.radius;
        const width = this.radius;
        const left = `M 0 0 L ${barWidth} 0 L ${barWidth} ${height} L 0 ${height} L 0 0 Z`;
        const right = `M ${barWidth + barSpacing} 0 L ${width} 0 L ${width} ${height} L ${barWidth + barSpacing} ${height} L ${barWidth + barSpacing} 0 Z`;
        return `${left} ${right}`;
      },
      playPath() {
        const height = this.radius;
        const rightX = this.radius - 1;
        const rightY = this.radius / 2;
        return `M 1 0 L 1 ${height} L ${rightX} ${rightY} L 1 0 Z`;
      },
      pauseTransform() {
        const cx = this.cx - (this.radius / 2);
        const cy = this.cy - (this.radius / 2);
        return `translate(${cx}, ${cy})`;
      },
      playTransform() {
        // this is the center of a rectangle around the triangle, not the triangle itself
        // so it will appear a bit to the left.  @@@ calc triangle center and adjust cx
        // accordingly.
        const cx = this.cx - (this.radius / 2);
        const cy = this.cy - (this.radius / 2);
        return `translate(${cx}, ${cy})`;
      },
    }
  }
</script>

<style lang="scss" scoped>
  .ring {
    stroke: var(--sv-audio-widget-play-button-progress-color, #00A);
    fill: var(--sv-audio-widget-play-button-fill-color, #EEE);
    transition: stroke-dashoffset 0.35s;
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
    cursor: pointer;
  }

  .play-button:hover {
    .play,
    .pause {
      fill: var(--sv-audio-widget-play-button-hover-icon-color, #666);
    }
  }

  .play,
  .pause {
    fill: var(--sv-audio-widget-play-button-icon-color, #AAA);
    cursor: pointer;
  }
</style>
