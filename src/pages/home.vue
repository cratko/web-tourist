<script>
import Navbar from '../components/navbar.vue';
import Map from '../components/map.vue';
import Model from '../components/model.vue';
import Routes from '../components/routes.vue';
import Tasks from '../components/tasks.vue';
import { useCookies } from "vue3-cookies";
import {ref, watch} from 'vue';
import { f7 } from 'framework7-vue';

const radius = ref(50);

let places = ref([]);
const selectedTags = ref([]);
const tags = ref();
const trueIndices = ref([]);
const popupPayment = ref(false);
const { cookies } = useCookies();

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
  fetch('https://hack-koespe.bgitu-compass.ru/tags/', { 
    method: "GET",
    headers: { 'Content-type': 'application/json; charset=UTF-8'},
    })
    .then((response) => response.json())
    .then((json) => {
        tags.value = json;
        tags.value.sort(function(a, b) {
            return parseFloat(a.id) - parseFloat(b.id);
        });
    });

watch(selectedTags.value, async() => {
  console.log('detected');
  trueIndices.value = selectedTags.value.map((value, index) => value ? index : null)
  .filter(index => index !== null);

  fetch('https://hack-koespe.bgitu-compass.ru/places', { 
    method: "POST",
    headers: { 'Content-type': 'application/json; charset=UTF-8'},
    body: JSON.stringify({
        current_lat: currentLocation.value.latitude,
        current_lon: currentLocation.value.longitude,
        radius_km: 50,
        tags: trueIndices.value
    }),
    })
    .then((response) => response.json())
    .then((json) => {
        places.value = json;
    });
})

var currentLocation = ref(await getLocationFromUser());
fetch('https://hack-koespe.bgitu-compass.ru/places', { 
    method: "POST",
    headers: { 'Content-type': 'application/json; charset=UTF-8'},
    body: JSON.stringify({
        current_lat: currentLocation.value.latitude,
        current_lon: currentLocation.value.longitude,
        radius_km: 50,
        tags: trueIndices.value
    }),
    })
    .then((response) => response.json())
    .then((json) => {
        places.value = json;
    });


watch(radius, async (newQuestion, oldQuestion) => {
  if (radius.value != "") {
      fetch('https://hack-koespe.bgitu-compass.ru/places', { 
    method: "POST",
    headers: { 'Content-type': 'application/json; charset=UTF-8'},
    body: JSON.stringify({
        current_lat: currentLocation.value.latitude,
        current_lon: currentLocation.value.longitude,
        radius_km: radius.value,
        tags: trueIndices.value
    }),
    })
    .then((response) => response.json())
    .then((json) => {
        places.value = json;
    });
  }
})

watch(radius, async (newQuestion, oldQuestion) => {
  if (radius.value != "") {
      fetch('https://hack-koespe.bgitu-compass.ru/places', { 
    method: "POST",
    headers: { 'Content-type': 'application/json; charset=UTF-8'},
    body: JSON.stringify({
        current_lat: currentLocation.value.latitude,
        current_lon: currentLocation.value.longitude,
        radius_km: radius.value,
        tags: trueIndices.value
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
const user = ref()


fetch('https://hack-koespe.bgitu-compass.ru/profile?access_token='+cookies.get("access_token"), { 
    method: "GET",
    headers: { 'Content-type': 'application/json; charset=UTF-8'},
    })
    .then((response) => response.json())
    .then((json) => {
        user.value = json;
        cookies.set("user_id", json.id);
    });

console.log(cookies.get('user_id'))


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

const getTagName = (tagId) => {
    if (tags.value) {
      return tags.value[tagId-1].name;
    }

};
const buttonPaymentUrl = ref('');

function openPaymentPopup(guideId, placeId) {
  popupPayment.value = true;
  fetch('https://hack-koespe.bgitu-compass.ru/profile?access_token='+cookies.get("access_token"), { 
    method: "GET",
    headers: { 'Content-type': 'application/json; charset=UTF-8'},
    })
    .then((response) => response.json())
    .then((json) => {
        user.value = json;
        let paymentData = {guide_id: guideId, place_id: placeId, user_id: json.id,
    amount: 500
  }
  fetch('https://hack-koespe.bgitu-compass.ru/payments/create', { 
    method: "POST",
    headers: { 'Content-type': 'application/json; charset=UTF-8'},
    body: JSON.stringify(
      paymentData
    ),
    })
    .then((response) => response.json())
    .then((json) => {
        buttonPaymentUrl.value = json.payment_url;
        //f7.view.main.router.navigate(buttonPaymentUrl.value);
    });
    });




};



export default {
  components: {
    Navbar,
    Map,
    Model,
    Routes,
    Tasks
  },
  methods: {
    
  },
  data() {
    return {radius, places, popupOpened, openedPlace, produceAnAlert, tags, 
      selectedTags, getTagName, popupPayment, openPaymentPopup, buttonPaymentUrl}
  }
}
</script>

<template>
  <!-- Payment Popup -->
    <f7-popup v-model:opened="popupPayment" class="popup-payment" style="height: 35%" >
        <f7-page>
          <f7-navbar title="Оплата гида">
            <f7-nav-right>
              <f7-link popup-close><i class="f7-icons">
                multiply</i></f7-link>
            </f7-nav-right>
          </f7-navbar>
          <f7-block strong inset v-model="buttonPaymentUrl">
          
            <f7-button :href="buttonPaymentUrl" external>Оплатить (500 руб)</f7-button>
            <f7-button tonal round>Списать бонусы</f7-button>
    </f7-block>
      </f7-page>
      </f7-popup>

  <f7-popup v-model:opened="popupOpened" class="demo-popup" v-if="openedPlace" tablet-fullscreen="true">
      <f7-page>
        <f7-navbar :title="openedPlace.title">
          <f7-nav-left>
            <i class="f7-icons" style='color: #71723a; padding-left: 15px'>info_circle</i>
          </f7-nav-left>
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
        @click="openPaymentPopup(guide.id, openedPlace.id)"
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
  <f7-page name="home">
    <!-- Top Navbar -->
    <Navbar/>

    <div class="grid grid-cols-2 grid-gap">
        
        <f7-block strong inset class="main-block">

            <f7-toolbar bottom tabbar>
              <f7-link tab-link="#tab-1" tab-link-active class='left-menu-link'>
                <i class="f7-icons">map_pin_ellipse</i>
                Объекты
              </f7-link>
              <f7-link tab-link="#tab-2" class='left-menu-link'>
                <i class="f7-icons">location_fill</i>
                Маршруты
              </f7-link>
              
              <f7-link tab-link="#tab-3" class='left-menu-link'>
                <i class="f7-icons">
                  square_favorites</i>
                Задания <f7-badge style='background-color:#48473b !important'>2</f7-badge>
              </f7-link>
            </f7-toolbar>

            <f7-tabs>
              <f7-tab id="tab-1" class="page-content" tab-active> 
                <f7-button round popup-open=".filtersPopup" class='filter-button'>
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
        :text="place.description"
      >
      <div class="item-subtitle"><span class='span-tag' v-for='tagId in place.tags'>{{ getTagName(tagId) }}</span></div>
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

              <!-- RoutesTab -->
              <f7-tab id="tab-2" class="page-content">
                <Routes/>
              </f7-tab>
              
              <!-- Tasks Tab -->
              <f7-tab id="tab-3" class="page-content"> 
                <Tasks/>
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
            Радиус отображения объектов:
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
  <f7-list simple-list strong outline-ios dividers-ios>
      <f7-list-item v-for='tag in tags'>
        <span>{{tag.name}}</span>
        <f7-toggle v-model:checked='selectedTags[tag.id]'></f7-toggle>
      </f7-list-item>
    </f7-list>

                </f7-block>
      </f7-page>
    </f7-popup>
    </div>
    

  </f7-page>

</template>
