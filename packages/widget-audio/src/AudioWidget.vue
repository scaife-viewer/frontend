<template>
  <div class="audio-widget" :key="urn.absolute">
    <audio ref="sound" :src="nowPlaying">No audio support</audio>
    <EmptyMessage v-if="nowPlaying === null" />
    <template v-else>
      <div class="player" v-if="sound !== undefined">
        <PlayButton
          @pressed="togglePlay"
          :playing="playing"
          :progress="progress"
        />
      </div>
      <Attribution>
        <!-- @@@ extract attribution from audio annotations  -->
        &copy; 2016
        <a href="https://hypotactic.com/" target="_blank">David Chamberlain</a>
        under
        <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank"
          >CC BY 4.0 License</a
        >
      </Attribution>
    </template>
  </div>
</template>

<script>
  import gql from 'graphql-tag';

  import { Attribution, EmptyMessage } from '@scaife-viewer/common';
  import { MODULE_NS, PLAY_AUDIO, STOP_AUDIO } from '@scaife-viewer/store';

  import PlayButton from './PlayButton.vue';

  export default {
    scaifeConfig: {
      displayName: 'Audio',
    },
    components: { Attribution, EmptyMessage, PlayButton },
    data() {
      return {
        nowPlayingIndex: 0,
        currentTime: 0,
        progress: 0,
        playing: false,
      };
    },
    watch: {
      currentSelection: {
        immediate: true,
        handler() {
          if (this.currentSelection !== null) {
            const index = this.audios.findIndex(a => {
              return a.data.references[0] === this.currentSelection;
            });
            if (index > -1) {
              this.nowPlayingIndex = index;
              this.$nextTick(() => this.start());
            }
          }
        },
      },
    },
    methods: {
      togglePlay() {
        if (this.sound.paused) {
          this.start();
        } else {
          this.stop();
        }
      },
      start() {
        this.$refs.sound.play();
        this.playing = true;
      },
      stop() {
        this.$refs.sound.pause();
        this.playing = false;
      },
      onTimeUpdate() {
        this.currentTime = this.$refs.sound.currentTime;
        if (!this.$refs.sound.duration) {
          this.progress = 0;
        } else {
          this.progress = this.currentTime / this.$refs.sound.duration;
        }
      },
      onStarted() {
        const ref = this.audios[this.nowPlayingIndex].data.references[0];
        this.$store.dispatch(`${MODULE_NS}/${PLAY_AUDIO}`, { ref });
        this.playing = true;
      },
      onEnded() {
        this.playing = false;
        this.$store.dispatch(`${MODULE_NS}/${STOP_AUDIO}`);
        if (this.nowPlayingIndex < this.audios.length - 1) {
          this.nowPlayingIndex += 1;
          this.$nextTick(() => {
            this.start();
          });
        }
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs.sound.addEventListener('timeupdate', this.onTimeUpdate);
        this.$refs.sound.addEventListener('ended', this.onEnded);
        this.$refs.sound.addEventListener('play', this.onStarted);
      });
    },
    beforeDestroy() {
      this.stop();
      this.$refs.sound.removeEventListener('timeupdate', this.onTimeUpdate);
      this.$refs.sound.removeEventListener('ended', this.onEnded);
    },
    computed: {
      icon() {
        return this.playing ? 'pause' : 'play';
      },
      currentSelection() {
        return this.$store.state[MODULE_NS].selectedLine;
      },
      audio() {
        if (this.nowPlayingIndex >= this.audios.length) {
          return null;
        }
        return this.audios[this.nowPlayingIndex];
      },
      nowPlaying() {
        return this.audio && this.audio.assetUrl;
      },
      attribution() {
        return this.audio && this.audio.data.attribution;
      },
      sound() {
        return this.$refs.sound;
      },
      urn() {
        return this.$store.getters[`${MODULE_NS}/urn`];
      },
      audios() {
        return this.audioData ? this.audioData : [];
      },
      audioMap() {
        return this.audios.reduce((map, obj) => {
          return {
            ...map,
            [obj.data.references[0]]: obj.assetUrl,
          };
        }, {});
      },
    },
    apollo: {
      audioData: {
        query: gql`
          query Audio($urn: String!) {
            passageTextParts(reference: $urn) {
              edges {
                node {
                  id
                  audioAnnotations {
                    edges {
                      node {
                        id
                        data
                        assetUrl
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        variables() {
          return { urn: this.urn.absolute };
        },
        update(data) {
          return data.passageTextParts.edges
            .map(e => e.node.audioAnnotations.edges.map(a => a.node))
            .flat();
        },
        skip() {
          return this.urn === null;
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  .audio-widget {
    margin: 0 2rem;
    flex: 1;
  }
  .hide {
    display: none;
  }
  .show {
    display: inherit;
  }
  button {
    display: block;
    width: 100%;
    outline: none;
    background: var(--sv-audio-widget-button-background-color, #f8f9fa);
    border: 1px solid var(--sv-audio-widget-button-border-color, #dee2e6);
    color: var(--sv-audio-widget-button-text-color, #495057);
    cursor: pointer;
    border-radius: 3px;
    font-size: 14px;
    padding: 0.5rem;
    &:hover {
      background: var(--sv-audio-widget-button-hover-background-color, #e9ecef);
      color: var(--sv-audio-widget-button-hover-text-color, #343a40);
    }
  }
  .player {
    text-align: center;
  }
  .audio-on {
    button {
      background: var(
        --sv-audio-widget-audio-on-button-background-color #b45141
      );
      border-color: var(
        --sv-audio-widget-audio-on-button-border-color,
        #9b4436
      );
      color: var(--sv-audio-widget-audio-on-button-text-color, #f8f9fa);
      &:hover {
        background: var(
          --sv-audio-widget-audio-on-button-hover-background-color,
          #9b4436
        );
        color: var(--sv-audio-widget-audio-on-button-hover-text-color, #fff);
      }
    }
  }
</style>
