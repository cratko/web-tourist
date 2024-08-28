<template>
    <yandex-map
    v-model="map"
    :height="height"
    real-settings-location
    :settings="{
        location: {
            ...LOCATION,
            duration: 2500,
        },
        camera,
        theme,
        showScaleInCopyrights: true,
    }"
    :width="width"
>
    <yandex-map-default-scheme-layer/>

    <yandex-map-controls :settings="{ position: 'bottom left' }">
        <template v-if="!locationChanged">
            <yandex-map-control-button
                :settings="{ onClick: () => [LOCATION = NEW_LOCATION_CENTER, camera.tilt = (45 * Math.PI) / 180, locationChanged = true]}"
            >
                Текущее местоположение
            </yandex-map-control-button>
        </template>
    </yandex-map-controls>

</yandex-map>

</template>

<script setup lang="ts">
import { YandexMap, YandexMapControlButton, YandexMapControls, YandexMapDefaultSchemeLayer, VueYandexMaps } from 'vue-yandex-maps';
import { ref, shallowRef, watch, computed } from 'vue';
import type { YMap, YMapCameraRequest } from '@yandex/ymaps3-types';
import type { YMapLocationRequest } from '@yandex/ymaps3-types/imperative/YMap';

const map = shallowRef<YMap | null>(null);
const locationChanged = ref(false);
const currentLocation = ref();

const camera = ref<YMapCameraRequest>({
    duration: 2500,
});


function getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    resolve({ latitude, longitude });
                },
                (error) => {
                    reject(`Ошибка получения местоположения: ${error.message}`);
                }
            );
        } else {
            reject("Геолокация не поддерживается вашим браузером.");
        }
    });
}

let pos = await getCurrentLocation();

const LOCATION = ref<YMapLocationRequest>({
            center: [0, 0], // starting position [lng, lat]
            zoom: 5, // starting zoom
});



const NEW_LOCATION_CENTER: YMapLocationRequest = {
    center: [2.294587, 48.859958], // [lng, lat]
    zoom: 16.6,
};

</script>
