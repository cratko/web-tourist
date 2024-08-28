<template>
    <yandex-map
        v-model="map"
        :settings="{
          location: {
            center: [currentLocation.coords.latitude, currentLocation.coords.longitude],
            zoom: 9,
          },
        }"
        width="100%"
        height="100%"
    >
      <yandex-map-default-scheme-layer/>
    </yandex-map>
    <button @click="locateMe">Get location</button>
</template>
  
<script setup lang="ts">
import { shallowRef, ref } from 'vue';
import type { YMap } from '@yandex/ymaps3-types';
import { YandexMap, YandexMapDefaultSchemeLayer } from 'vue-yandex-maps';

getCurrentLocation();

//Можно использовать для различных преобразований
const map = shallowRef<null | YMap>(null);
const currentLocation = ref([]);

const getCurrentLocation = async() => {
    return new Promise((resolve, reject) => {

    if(!("geolocation" in navigator)) {
    reject(new Error('Geolocation is not available.'));
    }

    navigator.geolocation.getCurrentPosition(pos => {
    resolve(pos);
    }, err => {
    reject(err);
    });

    });
}

const locateMe = async() => {
    currentLocation.value = getCurrentLocation();
}
</script>