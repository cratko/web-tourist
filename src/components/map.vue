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
import { YandexMap, YandexMapControlButton, YandexMapControls, YandexMapDefaultSchemeLayer } from 'vue-yandex-maps';
import { ref, shallowRef, watch } from 'vue';
import type { YMap, YMapCameraRequest } from '@yandex/ymaps3-types';
import type { YMapLocationRequest } from '@yandex/ymaps3-types/imperative/YMap';

const map = shallowRef<YMap | null>(null);
const locationChanged = ref(false);

const camera = ref<YMapCameraRequest>({
    duration: 2500,
});

const LOCATION = ref<YMapLocationRequest>({
    center: [37.623082, 55.75254], // starting position [lng, lat]
    zoom: 5, // starting zoom
});

// eslint-disable-next-line vue/no-ref-object-reactivity-loss
const OLD_LOCATION = ref<YMapLocationRequest>(LOCATION.value);

watch(LOCATION, (_, oldValue) => {
    OLD_LOCATION.value = oldValue;
});

const NEW_LOCATION_CENTER: YMapLocationRequest = {
    center: [2.294587, 48.859958], // [lng, lat]
    zoom: 16.6,
};

const NEW_LOCATION_BOUNDS: YMapLocationRequest = {
    bounds: [
        [-74.045667, 40.690044], // bounds - the boundaries of the visible area of the map
        [-74.043567, 40.688628], // [[lng, lat], [lng, lat]].
    ],
    zoom: 16.6,
};

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

</script>
