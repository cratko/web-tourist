<template>
    <yandex-map
        v-model="map"
        :settings="{
          location: {
            center: [currentLocation.coords.latitude ? currentLocation.coords.latitude : 0, 
                        currentLocation.coords.longitude ? currentLocation.coords.longitude : 0],
            zoom: 9,
          },
        }"
        width="100%"
        height="100%"
    >
      <yandex-map-default-scheme-layer/>
    </yandex-map>
    <f7-button @click="locateMe">Get location</f7-button>
</template>
  
<script lang="ts">
import { shallowRef, ref } from 'vue';
import type { YMap } from '@yandex/ymaps3-types';
import { YandexMap, YandexMapDefaultSchemeLayer } from 'vue-yandex-maps';

export default {
    setup() {
        const map = shallowRef<null | YMap>(null);
        const currentLocation = ref();

        return {map, currentLocation}

    },
    created() {
    //do we support geolocation
    if(!("geolocation" in navigator)) {
      console.log('Geolocation is not available.');
      return;
    }

    // get position
    navigator.geolocation.getCurrentPosition(pos => {
      this.currentLocation = pos;

    }, err => {
      console.log(err.message);
    })
    },
    methods: {
        locateMe() {
            if(!("geolocation" in navigator)) {
            console.log('Geolocation is not available.');
            return;
            }

            // get position
            navigator.geolocation.getCurrentPosition(pos => {
            this.currentLocation = pos;

            }, err => {
            console.log(err.message);
            })
        }
    }
}


</script>