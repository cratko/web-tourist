<script>
import Navbar from '../components/navbar.vue';
import Map from '../components/map.vue';
import {ref, watch} from 'vue';

const radius = ref(50);

let places = ref([]);

function getLocationFromUser (){
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          resolve(position.coords);
        }, reject);
      } else {
        reject('Geolocation not supported');
      }
    });
  }

var currentLocation = ref(await getLocationFromUser());
fetch('http://hackathon-koespe-db6f73-1b4fd0-185-174-136-205.traefik.me/places', { 
    method: "POST",
    headers: { 'Content-type': 'application/json; charset=UTF-8'},
    body: JSON.stringify({
        current_lat: currentLocation.value.latitude,
        current_lon: currentLocation.value.longitude,
        radius_km: 50,
        tags: []
    }),
    })
    .then((response) => response.json())
    .then((json) => {
        places.value = json;
    });


watch(radius, async (newQuestion, oldQuestion) => {
  if (radius.value != "") {
      fetch('http://hackathon-koespe-db6f73-1b4fd0-185-174-136-205.traefik.me/places', { 
    method: "POST",
    headers: { 'Content-type': 'application/json; charset=UTF-8'},
    body: JSON.stringify({
        current_lat: currentLocation.value.latitude,
        current_lon: currentLocation.value.longitude,
        radius_km: radius.value,
        tags: []
    }),
    })
    .then((response) => response.json())
    .then((json) => {
        places.value = json;
    });
  }
})

const openedPlace = ref();
const popupOpened = ref();

const produceAnAlert = (placeId) => {
    fetch('http://hackathon-koespe-db6f73-1b4fd0-185-174-136-205.traefik.me/places/'+placeId, { 
    method: "GET",
    headers: { 'Content-type': 'application/json; charset=UTF-8'},
    })
    .then((response) => response.json())
    .then((json) => {
        openedPlace.value = json;
    });
    popupOpened.value = true;
};


export default {
  components: {
    Navbar,
    Map
  },
  data() {
    return {radius, places, popupOpened, openedPlace, produceAnAlert}
  }
}
</script>

<template>
  <f7-popup v-model:opened="popupOpened" class="demo-popup" v-if="openedPlace" tablet-fullscreen="true">
      <f7-page>
        <f7-navbar :title="openedPlace.title">
          <f7-nav-right>
            <f7-link popup-close @click="openedPlace = false"><i class="f7-icons">
                multiply</i></f7-link>
          </f7-nav-right>
        </f7-navbar>

        <f7-block>
            <f7-block strong inset>
                <swiper-container :pagination="true" class="demo-swiper-multiple" :space-between="50">
                    <swiper-slide v-for="imgUrl in openedPlace.photos_url"><img :src="imgUrl"/></swiper-slide>
                </swiper-container>
            </f7-block>

        <f7-block strong inset class="places-box">
            <f7-block-title>
              Описание
            </f7-block-title>
            <p>{{ openedPlace.description }}</p>
            </f7-block>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse faucibus mauris
            leo, eu bibendum neque congue non. Ut leo mauris, eleifend eu commodo a, egestas ac
            urna. Maecenas in lacus faucibus, viverra ipsum pulvinar, molestie arcu. Etiam lacinia
            venenatis dignissim. Suspendisse non nisl semper tellus malesuada suscipit eu et eros.
            Nulla eu enim quis quam elementum vulputate. Mauris ornare consequat nunc viverra
            pellentesque. Aenean semper eu massa sit amet aliquam. Integer et neque sed libero
            mollis elementum at vitae ligula. Vestibulum pharetra sed libero sed porttitor.
            Suspendisse a faucibus lectus.
          </p>
          <p>
            Duis ut mauris sollicitudin, venenatis nisi sed, luctus ligula. Phasellus blandit nisl
            ut lorem semper pharetra. Nullam tortor nibh, suscipit in consequat vel, feugiat sed
            quam. Nam risus libero, auctor vel tristique ac, malesuada ut ante. Sed molestie, est in
            eleifend sagittis, leo tortor ullamcorper erat, at vulputate eros sapien nec libero.
            Mauris dapibus laoreet nibh quis bibendum. Fusce dolor sem, suscipit in iaculis id,
            pharetra at urna. Pellentesque tempor congue massa quis faucibus. Vestibulum nunc eros,
            convallis blandit dui sit amet, gravida adipiscing libero.
          </p>
        </f7-block>

      </f7-page>
    </f7-popup>
  <f7-page name="home">
    <!-- Top Navbar -->
    <Navbar/>

    <div class="grid grid-cols-2 grid-gap">
        
        <f7-block strong inset class="main-block">

            <f7-block-title>
              Strong Inset Block
            </f7-block-title>

            <f7-toolbar bottom tabbar>
              <f7-link tab-link="#tab-1" tab-link-active class='left-menu-link'>
                <i class="f7-icons">map_pin_ellipse</i>
                Объекты
              </f7-link>
              <f7-link tab-link="#tab-2" class='left-menu-link'>
                <i class="f7-icons">location_fill</i>
                Маршруты
              </f7-link>
            </f7-toolbar>

            <f7-tabs>
              <f7-tab id="tab-1" class="page-content" tab-active> 
                <f7-button round popup-open=".filtersPopup">
                  <i class="f7-icons">
                    slider_horizontal_3</i>Фильтры
                  </f7-button>
                  <f7-block strong inset class="places-block">
                    <f7-block-title>Ближайшие места</f7-block-title>
    <f7-list media-list dividers-ios strong-ios outline-ios>
      <f7-list-item
      v-model="places"
        v-for="place in places"
        link="#"
        @click="produceAnAlert(place.id)"
        :title="place.title"
        after="$15"
        :subtitle="place.description"
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
    </f7-list>
                  </f7-block>


              </f7-tab>
              <f7-tab id="tab-2" class="page-content">
                <f7-block>
                 
                </f7-block>
              </f7-tab>
            </f7-tabs>

            
    </f7-block>

    <f7-block strong inset class="main-block">
      <Map v-model:radius="radius" v-model:places="places" v-model:currentLocation="currentLocation" />
    </f7-block>
    
    <f7-popup class="filtersPopup" swipe-to-close>
      <f7-page>
        <f7-navbar title="Фильтр объектов">
          <f7-nav-right>
            <f7-link popup-close><i class="f7-icons">
                multiply</i></f7-link>
          </f7-nav-right>
        </f7-navbar>

        <f7-block strong inset>
          <f7-block-title>
            Радиус отображения объектов: {{ radius }}
            </f7-block-title>
                    <f7-input
    type="text"
    placeholder="Расстояние в км"
    v-model:value="radius"
    value="number"
    required
        validate
        pattern="[0-9]*"
  />
                </f7-block>
      </f7-page>
    </f7-popup>
    </div>
    

  </f7-page>
</template>
