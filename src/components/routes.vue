<template>
        <f7-block-title>Готовые маршруты</f7-block-title>
    <f7-block>
        <f7-block strong class="text-align-center" v-if="isLoading">
      <f7-preloader v-if="isLoading"/>
    </f7-block>
    <f7-list media-list dividers-ios strong-ios outline-ios>
      
      <f7-list-item
      v-model="routes"
        v-for="route in routes"
        link="#"
        @click="chooseRoute(route)"
        :title="route.name"
        :text="route.description"
      >
        <template #media>
          <img
            style="border-radius: 8px"
            :src="route.place_objects_array[0].photos_url[0]"
            width="80"
          />
        </template>
      </f7-list-item>
      </f7-list>
      </f7-block>
      <f7-popup v-model:opened="popupOpened" class="demo-popup" v-if="choosedRoute">
      <f7-page>
        <f7-navbar :title="choosedRoute.name">
          <f7-nav-right>
            <f7-link popup-close><i class="f7-icons">
                multiply</i></f7-link>
          </f7-nav-right>
        </f7-navbar>
        <f7-list media-list dividers-ios strong-ios outline-ios >
    <div class="timeline-item" style="align-items: center" v-for="place in choosedRoute.place_objects_array">
        <div class="timeline-item-date"><i class="f7-icons" style="color: #71723a;">
            arrow_down</i></div>
        <div class="timeline-item-divider"></div>
      <f7-list-item
        v-model="choosedRoute"
        style="max-width: 550px"
        link="#"
        :title="place.title"
        :text="place.description"
      >
        <template #media>
          <img
            style="border-radius: 8px"
            :src="place.photos_url[0]"
            width="80"
          />
        </template>
      </f7-list-item>
      </div>
      </f7-list>
    </f7-page>
    </f7-popup>
</template>

<script setup>
import {ref} from 'vue';

const routes = ref();
const isLoading = ref(true);
const popupOpened = ref(false);
const choosedRoute = ref();
let routesParams = {
    isChild: true
};

function chooseRoute(route) {
    popupOpened.value = true;
    choosedRoute.value = route;
    console.log(choosedRoute.value);
}

fetch('https://hack-koespe.bgitu-compass.ru/prepared_routes', {
        method: 'POST',
        body: JSON.stringify(routesParams),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => response.json() )
        .then((json) => {
          routes.value = json;
          isLoading.value = false;
          console.log(json);
      })

</script>