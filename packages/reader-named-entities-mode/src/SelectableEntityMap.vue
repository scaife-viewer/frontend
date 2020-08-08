<template>
  <div class="selectable-entity-map">
    <EntityMap
      :coordinates-list="coordinatesList"
      :selectedEntities="selectedEntities"
      @selected="placeId => $emit('selected', placeId)"
    />
  </div>
</template>

<script>
  import EntityMap from '@scaife-viewer/entity-map';

  export default {
    props: ['coordinatesList', 'selectedEntities'],
    components: { EntityMap },
  };
</script>

<style lang="scss">
  .map-direction-horizontal {
    .map {
      padding-left: 1rem;
      border-left: 1px solid $gray-300;
    }
  }
  .map-direction-vertical {
    .map {
      padding-top: 1rem;
      border-top: 1px solid $gray-300;
    }
  }
</style>

<style lang="scss" scoped>
  .selectable-entity-map {
    height: 100%;
  }
</style>
