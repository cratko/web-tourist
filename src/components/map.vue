<template>
<yandex-map
    v-model="map"
    v-if="!openedPlace"
    real-settings-location
    :settings="{
        location: {
            center: [36.27309, 54.512538],
            zoom: 17,
        },
        camera: { azimuth: mapAzimuth, tilt: mapTilt, duration: hasAutoRotate ? 0 : 250 },
        showScaleInCopyrights: true,
    }"
>
    <yandex-map-default-scheme-layer/>
    <yandex-map-default-features-layer/>

    <yandex-map-marker
        v-model="defaultMarker"
        v-if="places"
        v-for="place in places"
        :key="place.id"
        position="top-center left-center"
        :settings="{ coordinates: [place.longitude, place.latitude] }"
    > 
    <img
            alt=""
            class="pin"
            :src="place.photos_url[0]"
            @click="produceAnAlert(place.id)"
        >
</yandex-map-marker>
    <yandex-map-listener :settings="{ onActionStart: () => hasAutoRotate = false }"/>
     <yandex-map-controls :settings="{ position: 'right' }">
        <yandex-map-zoom-control/>
    </yandex-map-controls>
    <yandex-map-controls :settings="{ position: 'top' }">
        <yandex-map-control-button
            :settings="{ color: '#fff', background: hasAutoRotate ? '#fd6466e6' : '#007afce6', onClick: () => hasAutoRotate = !hasAutoRotate }"
        >
            Авто-поворот
        </yandex-map-control-button>
        <yandex-map-control-button :settings="{ onClick: () => updateCamera('azimuth', 'minus') }">
            Поворот влево
        </yandex-map-control-button>
        <yandex-map-control-button :settings="{ onClick: () => updateCamera('azimuth', 'plus') }">
            Поворот вправо
        </yandex-map-control-button>
        <yandex-map-control-button :settings="{ onClick: () => updateCamera('tilt', 'minus') }">
            Наклон наверх
        </yandex-map-control-button>
        <yandex-map-control-button :settings="{ onClick: () => updateCamera('tilt', 'plus') }">
            Наклон вниз
        </yandex-map-control-button>

    </yandex-map-controls>
    <yandex-map-controls :settings="{ position: 'left' }">
        <yandex-map-geolocation-control/>
    </yandex-map-controls>

</yandex-map>

<f7-popup v-model:opened="popupOpened" class="demo-popup" v-if="openedPlace" tablet-fullscreen="true">
      <f7-page>
        <f7-navbar :title="openedPlace.title">
          <f7-nav-right>
            <f7-link popup-close @click="openedPlace = false"><i class="f7-icons">
                multiply</i></f7-link>
          </f7-nav-right>
        </f7-navbar>

        <f7-block>
          <div class="grid grid-cols-2 grid-gap">
            <f7-block strong inset>
                <swiper-container :pagination="true" class="demo-swiper-multiple" :space-between="50">
                    <swiper-slide v-for="imgUrl in openedPlace.photos_url" class="img-swiper"><img class='img-swiper-img' :src="imgUrl"/></swiper-slide>
                </swiper-container>
            </f7-block>

            <f7-block strong inset v-if="openedPlace.stl_url">
                <Model v-model:stl_url="openedPlace.stl_url"></Model>
            </f7-block>
          </div>


          <div class="grid grid-cols-2 grid-gap">
        <f7-block strong inset class="places-box">
            <f7-block-title>
              Описание
            </f7-block-title>
            <p>{{ openedPlace.description }}</p>
            </f7-block>

            <f7-block strong inset >
              <f7-block-title>
              Отзывы
            </f7-block-title>
            <f7-list media-list dividers-ios strong-ios outline-ios>
              <f7-list-item class="rating-list"
        link="#"
        v-for="review in openedPlace.reviews"
        :title="review.user_name"
        :subtitle="review.date"
        :text="review.review"
        :badge="review.rating"
        badge-color="yellow"
      >
      
        <template #media>
          <img
            style="border-radius: 8px"
            src="https://i.pinimg.com/originals/1f/28/c6/1f28c68d2c35f389966b5a363b992d06.png"
            width="80"
          />
        </template>
      </f7-list-item>
            </f7-list>

            </f7-block>

            </div>

            <f7-block strong inset >
              <f7-block-title>
              Актуальные гиды
            </f7-block-title>
            <f7-list media-list dividers-ios strong-ios outline-ios>
              <f7-list-item
        link="#"
        v-for="guide in openedPlace.guides"
        :title="guide.fullname"
        :subtitle="guide.phone_number"
        :text="guide.description"
        badge="4.9 ★"
      >
        <template #media>
          <img
            style="border-radius: 8px"
            src="https://i.pinimg.com/originals/1f/28/c6/1f28c68d2c35f389966b5a363b992d06.png"
            width="80"
          />
        </template>
      </f7-list-item>
            </f7-list>

            </f7-block>

        </f7-block>

      </f7-page>
    </f7-popup>
</template>

<script setup lang="ts">

import {
    YandexMap,
    YandexMapControlButton,
    YandexMapControls,
    YandexMapDefaultSchemeLayer,
    YandexMapListener,
    YandexMapGeolocationControl,
    YandexMapZoomControl,
    YandexMapMarker,
    YandexMapDefaultFeaturesLayer,
    YandexMapDefaultMarker,
} from 'vue-yandex-maps';
import { nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch, onActivated, triggerRef } from 'vue';
import type { YMap } from '@yandex/ymaps3-types';
import type { LngLat } from '@yandex/ymaps3-types';
import Model from '../components/model.vue';

const hasAutoRotate = ref(true);
const mapAzimuth = ref(0);
const mapTilt = ref((40 * Math.PI) / 180);
const frame = ref<null | number>(null);
const map = shallowRef<YMap | null>(null);
const radius = defineModel('radius');
const places = defineModel('places');
const currentLocation = defineModel('currentLocation');
console.log(places.value)

const defaultMarker = ref<null | number>(null) ;
const popupOpened =  ref(false);
watch(places, async (newQuestion, oldQuestion) => {
    triggerRef(defaultMarker);
    console.log('triggered')
    console.log(places);
})

// Automatically rotate the camera
const startAutoRotationCamera = () => {
    if (!map.value) return;

    if (hasAutoRotate.value) {
        //  Divide degrees by 100 to slow rotation to ~20 degrees / sec
        mapAzimuth.value = map.value.azimuth + ((10 * Math.PI) / 180 / 100);
        // Request the next frame of the animation
        frame.value = requestAnimationFrame(startAutoRotationCamera);

    // If the automatic rotation mode is stopped then cancel the request for the next animation frame
    }
    else if (frame.value) cancelAnimationFrame(frame.value);
};

watch([hasAutoRotate, map], () => {
    if (typeof requestAnimationFrame === 'undefined') return;
    requestAnimationFrame(startAutoRotationCamera);
}, {
    immediate: true,
});

onBeforeUnmount(() => {
    if (frame.value) {
        hasAutoRotate.value = false;
        cancelAnimationFrame(frame.value);
    }
    
});


onActivated(() => {
console.log(document.getElementsByClassName('ymaps3x0--geolocation-control'));
})

const updateCamera = async (type: 'azimuth' | 'tilt', direction: 'minus' | 'plus') => {
    hasAutoRotate.value = false;
    await nextTick();
    if (frame.value) cancelAnimationFrame(frame.value);

    mapAzimuth.value = map.value!.azimuth;
    mapTilt.value = map.value!.tilt;

    switch (type) {
        case 'azimuth':
            mapAzimuth.value = map.value!.azimuth + ((30 * Math.PI) / (180 * (direction === 'minus' ? -1 : 1)));
            break;
        case 'tilt':
            mapTilt.value = map.value!.tilt + ((10 * Math.PI) / (180 * (direction === 'minus' ? -1 : 1)));
            break;
        default:
    }
};


const openedPlace = ref();

const produceAnAlert = (placeId) => {
    fetch('https://hack-koespe.bgitu-compass.ru/places/'+placeId, { 
    method: "GET",
    headers: { 'Content-type': 'application/json; charset=UTF-8'},
    })
    .then((response) => response.json())
    .then((json) => {
        openedPlace.value = json;
    });
    popupOpened.value = true;
};


const markers = [
    {
        coordinates: [37.623, 55.752] as LngLat,
        iconSrc:
            'https://yastatic.net/s3/front-maps-static/maps-front-jsapi-3/examples/images/marker-custom-icon/yellow-capybara.png',
    },
    {
        coordinates: [38.125, 55.622] as LngLat,
        iconSrc:
            'https://yastatic.net/s3/front-maps-static/maps-front-jsapi-3/examples/images/marker-custom-icon/purple-capybara.png',
    },
    {
        coordinates: [37.295, 55.415] as LngLat,
        iconSrc:
            'https://yastatic.net/s3/front-maps-static/maps-front-jsapi-3/examples/images/marker-custom-icon/green-capybara.png',
    },
];





//console.log(places);



</script>

<style scoped>
.pin {
  cursor: pointer;
  max-width: unset;
  width: 75px;
  height: 75px;
  border-radius: 50%;
}
</style>
