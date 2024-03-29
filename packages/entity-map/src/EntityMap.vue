<template>
  <MglMap
    :zoom="10"
    :accessToken="accessToken"
    :mapStyle="mapStyle"
    :center="center"
    @load="onMapLoaded"
  >
    <EntityMapMarker
      v-for="(coordinates, idx) in coordinatesList"
      :key="getMarkerKey(coordinates[2], idx)"
      :lat="coordinates[0]"
      :lng="coordinates[1]"
      :placeId="coordinates[2]"
      :placeLabel="coordinates[3]"
      :selected="
        selectedEntities.filter(id => coordinates[2] === id).length > 0
      "
      @selected="onSelect"
    />
    <MglNavigationControl position="top-right" />
  </MglMap>
</template>

<script>
  import Mapbox from 'mapbox-gl';
  import { MglMap, MglNavigationControl } from 'vue-mapbox';
  import EntityMapMarker from './EntityMapMarker.vue';

  export default {
    props: ['coordinatesList', 'selectedEntities'],
    components: {
      MglMap,
      MglNavigationControl,
      EntityMapMarker,
    },
    created() {
      this.map = null;
      this.mapbox = Mapbox;
    },
    methods: {
      onSelect(placeId) {
        if (!this.selectedEntities.filter(id => placeId === id).length > 0) {
          this.$emit('selected', placeId);
        }
      },
      onMapLoaded(event) {
        this.map = event.map;
        if (this.coordinatesList.length > 1) {
          this.map.fitBounds(this.boundingBox);
        }
      },
      getMarkerKey(entityId, idx) {
        // constructs a key that will be recomputed
        // when the value of `selectedNamedEntities` changes in the store
        const isSelected =
          this.selectedEntities.filter(id => entityId === id).length > 0;
        return `${entityId}::${idx}::${isSelected}`;
      },
    },
    watch: {
      coordinatesList: {
        immediate: true,
        handler() {
          this.$nextTick(() => {
            if (this.map !== null) {
              if (this.coordinatesList.length > 1) {
                this.map.fitBounds(this.boundingBox);
              } else {
                this.map.setCenter(this.boundingBox[0]);
              }
            }
          });
        },
      },
    },
    computed: {
      center() {
        const lat = this.coordinatesList[0][0];
        const lng = this.coordinatesList[0][1];
        return [lng, lat];
      },
      config() {
        return this.$scaife.config.entityMap;
      },
      accessToken() {
        return this.config.accessToken;
      },
      mapStyle() {
        return this.config.mapStyle;
      },
      boundingBox() {
        // NOTE: MapBox assumes coordinates in
        // longitue, latitude format
        // https://soal.github.io/vue-mapbox/api/marker.html#props
        // https://docs.mapbox.com/mapbox-gl-js/api/geography/#lnglatlike
        // https://geojson.org/geojson-spec.html#positions
        return this.coordinatesList.map(c => {
          const lat = c[0];
          const lng = c[1];
          return [lng, lat];
        });
      },
    },
  };
</script>

<style src="mapbox-gl/dist/mapbox-gl.css"></style>
