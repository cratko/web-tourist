<template>
    <div class="center-preloader">
        <f7-preloader color="orange" />
    </div>
    <yandex-map
        v-if="currentLocation.coords"
        v-model="map"
        :settings="{
          location: {
            center: [currentLocation.coords.latitude, 
                        currentLocation.coords.longitude],
            zoom: 9,
          },
        }"
        width="100%"
        height="100%"
    >
      <yandex-map-default-scheme-layer/>
    </yandex-map>
    <f7-button v-if="currentLocation.coords" @click="locateMe">Get location</f7-button>
</template>
  
<script lang="ts">
import { shallowRef, ref } from 'vue';
import type { YMap } from '@yandex/ymaps3-types';
import { YandexMap, YandexMapDefaultSchemeLayer } from 'vue-yandex-maps';

export default {
    setup() {
        const map = shallowRef<null | YMap>(null);
        const currentLocation = ref(false);

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
      console.log(this.currentLocation)

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
            console.log(this.currentLocation.coords)

            }, err => {
            console.log(err.message);
            })
        }
    }
}


</script>