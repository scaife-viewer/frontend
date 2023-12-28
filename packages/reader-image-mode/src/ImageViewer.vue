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
          <a
            :id="`${reference}-highlight-roi`"
            class="link"
            :class="{ active: showClickableRois }"
            title="Highlight regions of interest"
            @click.prevent="showClickableRois = !showClickableRois"
          >
            <icon name="highlighter" />
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
  import {
    Attribution,
    SCHOLIA_KIND_MAIN,
    SCHOLIA_KIND_EXTERIOR,
    SCHOLIA_KIND_INTERLINEAR,
    SCHOLIA_KIND_INTERMARGINAL,
    SCHOLIA_KIND_INTERIOR,
    // SCHOLIA_KIND_MISC,
    SCHOLIA_URN_MAIN,
    SCHOLIA_URN_EXTERIOR,
    SCHOLIA_URN_INTERLINEAR,
    SCHOLIA_URN_INTERMARGINAL,
    SCHOLIA_URN_INTERIOR,
  } from '@scaife-viewer/common';
  import {
    MODULE_NS,
    HIGHLIGHT_TRANSCRIPTION,
    SELECT_SCHOLION,
  } from '@scaife-viewer/store';

  function getClassForRoi(roi) {
    // TODO: These are hardcoded to URNs
    if (roi.data) {
      const surface = roi.data['urn:cite2:hmt:va_dse.v1.surface:'];
      if (surface) {
        return 'folio-text';
      }
    }
    if (roi.textAnnotations.edges.length > 0) {
      const firstEdge = roi.textAnnotations.edges[0];
      const { urn } = firstEdge.node;
      if (urn.startsWith(SCHOLIA_URN_MAIN)) {
        return SCHOLIA_KIND_MAIN;
      }
      if (urn.startsWith(SCHOLIA_URN_EXTERIOR)) {
        return SCHOLIA_KIND_EXTERIOR;
      }
      if (urn.startsWith(SCHOLIA_URN_INTERLINEAR)) {
        return SCHOLIA_KIND_INTERLINEAR;
      }
      if (urn.startsWith(SCHOLIA_URN_INTERMARGINAL)) {
        return SCHOLIA_KIND_INTERMARGINAL;
      }
      if (urn.startsWith(SCHOLIA_URN_INTERIOR)) {
        return SCHOLIA_KIND_INTERIOR;
      }
    }
    // FIXME: Determine what we want for our return value
    // return SCHOLIA_KIND_MISC;
    return null;
  }

  function createOverlay(roi, className = 'roi-highlight') {
    const { coordinatesValue } = roi;
    const overlay = document.createElement('div');
    const additionalClassName = getClassForRoi(roi);
    // TODO: Fix style scoping
    overlay.className = additionalClassName
      ? `${className} image-viewer-${additionalClassName}`
      : className;
    overlay.id = coordinatesValue;

    return overlay;
  }

  function calculatePixelDimensions(location, { x, y }) {
    /*
  https://codepen.io/jacobwegner/pen/QWBqLXo
  "By default the viewport coordinates go from 0 to 1 along the
  horizontal axis, but from 0 to height / width on the vertical axis."
  https://github.com/openseadragon/openseadragon/issues/2046#issuecomment-940360219
  https://github.com/openseadragon/openseadragon/issues/1793
  This is why we have drift on the vertical axis: the percentage-based
  y / height coordinates from IIIF must be changed to their viewport
  coordinate values imageToViewportRectangle converts from an image in pixels
  to viewport units
  */

    // Transform dimensions from percentages to pixels
    return [location[0] * x, location[1] * y, location[2] * x, location[3] * y];
  }
  function addRoiToViewer(roi, viewer) {
    const overlay = createOverlay(roi);
    const location = roi.coordinatesValue.split(',').map(s => parseFloat(s));
    const pixelDimensions = calculatePixelDimensions(
      location,
      viewer.source.dimensions,
    );

    const rect = viewer.viewport.imageToViewportRectangle(...pixelDimensions);
    viewer.addOverlay({
      element: overlay,
      location: rect,
    });
  }

  function createClickableOverlay(roi) {
    return createOverlay(roi, 'roi-clickable');
  }

  function createRect(coordinatesValue, viewer) {
    const location = coordinatesValue.split(',').map(s => parseFloat(s));
    const pixelDimensions = calculatePixelDimensions(
      location,
      viewer.source.dimensions,
    );

    return viewer.viewport.imageToViewportRectangle(...pixelDimensions);
  }

  export default {
    props: ['imageIdentifier', 'reference', 'roi'],
    data() {
      return {
        viewer: null,
        displayViewer: false,
        errorMessage: null,
        showClickableRois: false,
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
          const line = this.$store.state[MODULE_NS].selectedLine;

          // if (line) {
          //   debugger;
          //   this.$data.showClickableRois = false;
          // }

          this.clearRoiOverlays();
          this.drawRoiOverlays();

          return line;
        },
      },
      selectedScholion: {
        immediate: true,
        handler() {
          this.clearRoiOverlays();
          this.drawScholiaRoiOverlays();
        },
      },
      async showClickableRois(show) {
        this.clearRoiOverlays();

        if (show) {
          // because the store dispatches actions asynchronously,
          // we need to wait for them to be committed before
          // clearing the overlays, otherwise they don't
          // get drawn correctly.
          await this.clearHighlights();
          this.drawClickableRoiOverlays();
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
        return this.$store.state[MODULE_NS].selectedLine;
      },
      selectedScholion() {
        return this.$store.state[MODULE_NS].selectedScholion;
      },
      viewerOptions() {
        return {
          // options: http://openseadragon.github.io/docs/OpenSeadragon.Viewer.html#Viewer
          minZoomImageRatio: 0.5,
          maxZoomPixelRatio: 2.0,
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
      async clearHighlights() {
        await this.$store.dispatch(`${MODULE_NS}/${HIGHLIGHT_TRANSCRIPTION}`, {
          ref: null,
        });
        return this.$store.dispatch(`${MODULE_NS}/${SELECT_SCHOLION}`, {
          scholion: null,
        });
      },
      clearRoiOverlays() {
        if (this.viewer && this.viewer.currentOverlays.length > 0) {
          this.viewer.clearOverlays();
        }
      },
      drawClickableRoiOverlays() {
        this.$props.roi.forEach(r =>
          r.roi.forEach(roi => {
            const element = createClickableOverlay(roi);
            const location = createRect(roi.coordinatesValue, this.viewer);

            this.viewer.addOverlay({
              element,
              location,
            });

            const userData = {
              roi,
            };
            // eslint-disable-next-line no-new
            new OpenSeadragon.MouseTracker({
              element,
              // eslint-disable-next-line no-unused-vars
              clickHandler: event => {
                this.$store.dispatch(
                  `${MODULE_NS}/${HIGHLIGHT_TRANSCRIPTION}`,
                  {
                    ref: r.ref,
                  },
                );
              },
              userData,
            });
          }),
        );
      },
      drawRoiOverlays() {
        if (!this.viewer) {
          return;
        }

        const { selectedLine } = this.$store.state[MODULE_NS];

        // Vue's observers can cause the existence check to pass,
        // but `selectedLine` still won't have an `endsWith()`
        // function to call unless it is a string
        if (!selectedLine || typeof selectedLine !== 'string') {
          return;
        }

        const { roi } = this.$props;

        roi
          .filter(r => selectedLine.endsWith(r.ref))
          .forEach(line => {
            // it is possible for a line to have multiple
            // regions of interest
            line.roi.forEach(r => {
              addRoiToViewer(r, this.viewer);
            });
          });
      },
      drawScholiaRoiOverlays() {
        if (!this.viewer) {
          return;
        }

        const selectedScholion =
          this.$store.state[MODULE_NS].selectedScholion || {};
        const roi = selectedScholion.roi || [];

        roi.forEach(r => {
          addRoiToViewer(r, this.viewer);
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

  .roi-clickable {
    // TODO: Revisit styles after adding HMT borders
    // border: 4px solid
    //   var(--sv-widget-reader-dictionary-resolved-background-color, #9ad5f5);
    // opacity: 0.3;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }

  .roi-highlight {
    // TODO: Revisit styles after adding HMT borders
    // border: 4px solid
    //   var(--sv-widget-reader-token-selected-entity-shadow-color, #9f9);
    opacity: 0.6;
    border: 2px solid
      var(--sv-widget-reader-token-selected-entity-shadow-color, #9f9);
    &.image-viewer-scholia-kind-misc {
      background-color: var(
        --sv-widget-reader-image-mode-scholia-kind-misc-color,
        rgba(127, 127, 127, 0.5)
      );
    }
    &.image-viewer-scholia-kind-main {
      background-color: var(
        --sv-widget-reader-image-mode-scholia-kind-main-color,
        rgba(165, 127, 89, 0.5)
      );
    }
    &.image-viewer-scholia-kind-exterior {
      background-color: var(
        --sv-widget-reader-image-mode-scholia-kind-exterior-color,
        rgba(89, 89, 165, 0.5)
      );
    }
    &.image-viewer-scholia-kind-interlinear {
      background-color: var(
        --sv-widget-reader-image-mode-scholia-kind-interlinear-color,
        rgba(18, 203, 196, 0.5)
      );
    }
    &.image-viewer-scholia-kind-intermarginal {
      background-color: var(
        --sv-widget-reader-image-mode-scholia-kind-intermarginal-color,
        rgba(127, 165, 89, 0.5)
      );
    }
    &.image-viewer-scholia-kind-interior {
      background-color: var(
        --sv-widget-reader-image-mode-scholia-kind-interior-color,
        rgba(60, 99, 130, 0.5)
      );
    }
    &.image-viewer-folio-text {
      background-color: rgba(191, 63, 63, 0.5);
    }
  }
  // TODO: Refactor these classes as named constants for
  // re-use with widget-scholia
  .image-viewer-scholia-kind-misc {
    border: 2px solid
      var(
        --sv-widget-reader-image-mode-scholia-kind-misc-border-color,
        rgba(127, 127, 127, 1)
      );
  }
  .image-viewer-scholia-kind-main {
    border: 2px solid
      var(
        --sv-widget-reader-image-mode-scholia-kind-main-border-color,
        rgba(165, 127, 89, 1)
      );
  }
  .image-viewer-scholia-kind-exterior {
    border: 2px solid
      var(
        --sv-widget-reader-image-mode-scholia-kind-exterior-border-color,
        rgba(89, 89, 165, 1)
      );
  }
  .image-viewer-scholia-kind-interlinear {
    border: 2px solid
      var(
        --sv-widget-reader-image-mode-scholia-kind-interlinear-border-color,
        rgba(18, 203, 196, 1)
      );
  }
  .image-viewer-scholia-kind-intermarginal {
    border: 2px solid
      var(
        --sv-widget-reader-image-mode-scholia-kind-intermarginal-border-color,
        rgba(127, 165, 89, 1)
      );
  }
  .image-viewer-scholia-kind-interior {
    border: 2px solid
      var(
        --sv-widget-reader-image-mode-scholia-kind-interior-border-color,
        rgba(60, 99, 130, 1)
      );
  }
  .image-viewer-folio-text {
    border: 2px solid rgb(191, 63, 63);
  }
</style>

<style lang="scss" scoped>
  .open-seadragon {
    flex: 1;
    min-height: calc(100vh - 150px);
    display: flex;
    flex-direction: column;

    .viewer {
      width: 100%;
      flex: 1;
    }

    $link-base-color: var(
      --sv-reader-image-mode-openseadragon-hover-link-text-color,
      #fff
    );
    $link-highlight-color: var(
      --sv-reader-image-mode-openseadragon-hover-link-background-color,
      #b45141
    );

    .link {
      font-size: 18px;
      cursor: pointer;
      margin: 0 0.5rem;
      padding: 0.25rem;
      border-radius: 3px;
    }

    .active {
      color: $link-base-color;
      background: $link-highlight-color;
    }

    .link:hover {
      color: $link-base-color;
      background: $link-highlight-color;
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
