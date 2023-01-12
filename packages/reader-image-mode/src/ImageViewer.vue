<template>
  <div class="open-seadragon">
    <div :id="`${reference}-image-toolbar`" class="toolbar">
      <span v-show="displayViewer">
        <small>
          <a :id="`${reference}-home`" class="link" title="Go home">
            <icon name="home" />
          </a>
          <a :id="`${reference}-zoom-in`" class="link" title="Zoom in">
            <icon name="search-plus" />
          </a>
          <a :id="`${reference}-zoom-out`" class="link" title="Zoom out">
            <icon name="search-minus" />
          </a>
          <a
            :id="`${reference}-full-page`"
            class="link"
            title="Toggle full page"
          >
            <icon name="window-maximize" />
          </a>
        </small>
      </span>
    </div>
    <div v-show="displayViewer" :id="identifier" class="viewer"></div>
    <div v-show="errorMessage" class="error">
      <i class="fa fa-times-circle"></i>
      <span>&nbsp;<strong>Error:</strong></span>
      <p>{{ errorMessage }}</p>
    </div>
    <Attribution>
      <a href="http://www.homermultitext.org" target="_blank">
        Homer Multitext Project / Center for Hellenic Studies
      </a>
    </Attribution>
  </div>
</template>

<script>
  import OpenSeadragon from 'openseadragon';
  import { Attribution } from '@scaife-viewer/common';
  import { MODULE_NS } from '@scaife-viewer/store';

  export default {
    props: ['imageIdentifier', 'reference', 'roi'],
    data() {
      return {
        viewer: null,
        displayViewer: false,
        errorMessage: null,
      };
    },
    components: { Attribution },
    watch: {
      imageIdentifier: {
        immediate: true,
        handler() {
          this.updateImage();
        },
      },
      selectedLine: {
        immediate: true,
        handler() {
          this.drawRects();
          return this.$store.state[MODULE_NS].selectedLine
        }
      },
      viewer: {
        immediate: true,
        handler() {
          this.updateImage();
        },
      },
    },
    computed: {
      identifier() {
        return `image-viewer-${this.reference}`;
      },
      selectedLine() {
        return this.$store.state[MODULE_NS].selectedLine
      },
      viewerOptions() {
        return {
          // options: http://openseadragon.github.io/docs/OpenSeadragon.Viewer.html#Viewer
          maxZoomLevel: 5,
          showNavigator: true,
          homeFillsViewer: true,
          zoomInButton: `${this.reference}-zoom-in`,
          zoomOutButton: `${this.reference}-zoom-out`,
          homeButton: `${this.reference}-home`,
          fullPageButton: `${this.reference}-full-page`,
          id: this.identifier,
        };
      },
    },
    methods: {
      updateImage() {
        if (this.imageIdentifier && this.viewer) {
          this.viewer.open([`${this.imageIdentifier}info.json`]);
        }
      },
      drawRects() {
        if (!this.viewer) {
          return;
        }
        const roi = this.$props.roi;

        roi.forEach(_r => {
          _r.forEach(r => {
            const overlay = document.createElement('div');
            overlay.id = r.coordinatesValue;
            overlay.style.backgroundColor = 'greenyellow';
            overlay.style.opacity = 0.5;
            const location = r.coordinatesValue.split(',').map(s => parseFloat(s));
            console.log(location)
            this.viewer.addOverlay({
              element: overlay,
              location: new OpenSeadragon.Rect(...location)
            });
            console.log('overlay added?')
          });
        });
      },
      initViewer() {
        if (!this.viewer) {
          const instanceOptions = this.viewerOptions;
          this.viewer = OpenSeadragon(instanceOptions);
        }
        const openHandler = () => {
          this.errorMessage = null;
          this.displayViewer = true;
        };
        const openFailedHandler = err => {
          this.errorMessage = err.message;
          this.displayViewer = false;
        };
        this.viewer.addHandler('open', openHandler, false);
        this.viewer.addHandler('open-failed', openFailedHandler, false);
      },
    },
    mounted() {
      this.initViewer();
      this.displayViewer = false;
    },
  };
</script>

<style lang="scss">
  .main-layout.main-layout-wide {
    flex: 4;
    .open-seadragon {
      padding-left: 1rem;
      border-left: 1px solid
        var(
          --sv-reader-image-mode-wide-layout-openseadragon-border-color,
          #dee2e6
        );
    }
    .image .open-seadragon {
      border: none;
      padding-left: 0;
    }
  }
</style>

<style lang="scss" scoped>
  .open-seadragon {
    flex: 1;
    height: calc(100vh - 150px);
    display: flex;
    flex-direction: column;
    .viewer {
      width: 100%;
      flex: 1;
    }

    .highlight {
      background-color: greenyellow;
      opacity: 0.5;
    }

    .link {
      font-size: 18px;
      cursor: pointer;
      margin: 0 0.5rem;
      padding: 0.25rem;
      border-radius: 3px;
    }
    .link:hover {
      color: var(
        --sv-reader-image-mode-openseadragon-hover-link-text-color,
        #fff
      );
      background: var(
        --sv-reader-image-mode-openseadragon-hover-link-background-color,
        #b45141
      );
    }

    .error {
      margin: 10px 0px;
      padding: 12px;
      color: var(--sv-reader-image-mode-error-text-color, #d8000c);
      background-color: var(
        --sv-reader-image-mode-error-background-color,
        #ffd2d2
      );
      vertical-align: middle;
      max-width: 40em;
    }
  }
</style>
