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
          const bbox = this.coordinatesList.map(c => {
            return [c[0], c[1]];
          });
          this.map.fitBounds(bbox);
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
                this.map.fitBounds(this.coordinatesList);
              } else {
                this.map.setCenter(this.coordinatesList[0]);
              }
            }
          });
        },
      },
    },
    computed: {
      center() {
        return [this.coordinatesList[0][0], this.coordinatesList[0][1]];
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
    },
  };
</script>

<style src="mapbox-gl/dist/mapbox-gl.css"></style>
