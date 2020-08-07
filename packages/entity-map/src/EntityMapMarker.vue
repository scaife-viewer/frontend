<template>
  <MglMarker ref="marker" :coordinates="[lat, lng]" @click="onMarkerClick">
    <MglPopup
      ref="popup"
      :showed="selected"
      :closeButton="false"
      :closeOnClick="false"
    >
      <div class="label">{{ placeLabel }}</div>
    </MglPopup>
  </MglMarker>
</template>

<script>
  import { MglMarker, MglPopup } from 'vue-mapbox';

  export default {
    components: { MglMarker, MglPopup },
    props: {
      lat: Number,
      lng: Number,
      placeId: String,
      placeLabel: String,
    },
    methods: {
      onMarkerClick() {
        this.$emit('selected', this.placeId);
      },
    },
  };
</script>
