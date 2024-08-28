<template>
    <div class="center-preloader">
        <f7-preloader color="orange" />
    </div>
    <div class="tabs">
    <div class="tabs_header">
        <div
            class="tabs_header_tab"
            :class="{ 'tabs_header_tab--active': tab === 'description' }"
            @click="tab = 'description'"
        >
            Описание
        </div>
        <div
            class="tabs_header_tab"
            :class="{ 'tabs_header_tab--active': tab === 'map' }"
            @click="tab = 'map'"
        >
            Карта
        </div>
    </div>
    <div class="tabs_content">
        <div
            v-if="tab === 'description'"
            class="tabs_content_description"
        >
            Скрипты Яндекса подгрузятся, когда вы переключите вкладки сверху - и не секундой раньше!
        </div>
        <yandex-map
            v-else-if="tab === 'map'"
            :height="height"
            :settings="{
                location: {
                    center,
                    zoom,
                },
                theme,
                showScaleInCopyrights: true,
            }"
            :width="width"
        >
            <yandex-map-default-scheme-layer/>
            <yandex-map-default-features-layer/>

            <yandex-map-controls :settings="{ position: 'top right' }">
                <yandex-map-control-button :settings="{ onClick: () => showMarker1 = !showMarker1 }">
                    Показать маркер 1
                </yandex-map-control-button>
                <yandex-map-control-button :settings="{ onClick: () => showMarker2 = !showMarker2 }">
                    Показать маркер 2
                </yandex-map-control-button>
            </yandex-map-controls>

            <yandex-map-marker
                v-if="showMarker1"
                :settings="{ coordinates: [center[0] + 0.1, center[1] + 0.1]}"
            >
                Маркер 1
            </yandex-map-marker>
            <yandex-map-marker
                v-if="showMarker2"
                :settings="{ coordinates: center }"
            >
                Маркер 2
            </yandex-map-marker>
        </yandex-map>
    </div>
</div>
</template>

<script setup>
import {
    YandexMap,
    YandexMapControlButton,
    YandexMapControls,
    YandexMapDefaultFeaturesLayer,
    YandexMapDefaultSchemeLayer,
    YandexMapMarker,
} from 'vue-yandex-maps';
import { ref } from 'vue';

const tab = ref('description');
const showMarker1 = ref(false);
const showMarker2 = ref(false);
</script>
