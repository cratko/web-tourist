<template>
    <f7-page name="profile_traveller">
        <f7-navbar title="Профиль">
          <f7-nav-right>
            <f7-link href="/"><i class="f7-icons">
                multiply</i></f7-link>
          </f7-nav-right>
        </f7-navbar>
        <f7-block-title>Личные данные</f7-block-title>
    <f7-list media-list dividers-ios strong-ios outline-ios>
      <f7-list-item
        link="#"
        :title="user.fullname"
        :subtitle="user.phone_number"
        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus."
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
    <f7-block>
        <div class="grid grid-cols-2 grid-gap">
                    <f7-button tonal round preloader @click="auth" :loading="isLoading">Изменить данные</f7-button>
                    <f7-button round preloader @click="logout">Выйти</f7-button>
                </div>
    </f7-block>

    <f7-block-title>Ваши туры</f7-block-title>
    <f7-block strong-ios outline-ios>
        <f7-list media-list dividers-ios strong-ios outline-ios>
      <f7-list-item
        link="#"
        v-model="tours"
        v-for="tour in tours"
        :title="tour.place.title"
        :subtitle="tour.guide.fullname"
        :text="tour.guide.phone_number"
        :after="tour.commentary"
      >
        <template #media>
          <img
            style="border-radius: 8px"
            :src="tour.place.photos_url[0]"
            width="80"
          />
        </template>
      </f7-list-item>
      
    </f7-list>
    </f7-block>

    <f7-block-title>Статистика маршрутов (км)</f7-block-title>
    <f7-block strong-ios outline-ios>
       
    </f7-block>
    
    <Chart
      :size="{ width: 500, height: 420 }"
      :data="data"
      :margin="margin"
      :direction="direction"
      :axis="axis">
  
      <template #layers>
        <Grid strokeDasharray="2,2" />
        <Area :dataKeys="['name', 'pl']" type="monotone" :areaStyle="{ fill: 'url(#grad)' }" />
        <Line
          :dataKeys="['name', 'pl']"
          type="monotone"
          :lineStyle="{
            stroke: '#71723a'
          }"
        />
        <Marker v-if="marker" :value="1000" label="Mean." color="green" strokeWidth="2" strokeDasharray="6 6" />
        <defs>
          <linearGradient id="grad" gradientTransform="rotate(90)">
            <stop offset="0%" stop-color="#be90ff" stop-opacity="1" />
            <stop offset="100%" stop-color="white" stop-opacity="0.4" />
          </linearGradient>
        </defs>
      </template>
  
      <template #widgets>
        <Tooltip
          borderColor="#48CAE4"
          :config="{
            pl: { color: '#9f7aea' },
            avg: { hide: true },
            inc: { hide: true }
          }"
        />
      </template>
  
    </Chart>

    </f7-page>
</template>

<script setup>
import { useCookies } from "vue3-cookies";
import {ref} from 'vue';
  import { Chart, Grid, Line } from 'vue3-charts'
  import { f7 } from 'framework7-vue';

const { cookies } = useCookies();

const user = ref({});
const tours = ref();

function logout() {
      cookies.remove("access_token");
      cookies.remove("role");
      f7.view.main.router.navigate("/");
}

fetch('https://hack-koespe.bgitu-compass.ru/profile?access_token='+cookies.get("access_token"), { 
    method: "GET",
    headers: { 'Content-type': 'application/json; charset=UTF-8'},
    })
    .then((response) => response.json())
    .then((json) => {
        user.value = json;
        console.log(json)
        fetch('https://hack-vika.bgitu-compass.ru/applications_of_guide/'+user.value.id, { 
        method: "GET",
        headers: { 'Content-type': 'application/json; charset=UTF-8'},
        })
        .then((response) => response.json())
        .then((json) => {
            tours.value = json;
            console.log(json);
        });
    });

    const data = ref([
  { name: 'Jan', pl: 1000, avg: 500, inc: 300 },
  { name: 'Feb', pl: 2000, avg: 900, inc: 400 },
  { name: 'Apr', pl: 400, avg: 400, inc: 500 },
  { name: 'Mar', pl: 3100, avg: 1300, inc: 700 },
  { name: 'May', pl: 200, avg: 100, inc: 200 },
  { name: 'Jun', pl: 600, avg: 400, inc: 300 },
  { name: 'Jul', pl: 500, avg: 90, inc: 100 }
])
      const direction = ref('horizontal')
      const margin = ref({
        left: 0,
        top: 20,
        right: 20,
        bottom: 0
      })
  
      const axis = ref({
        primary: {
          type: 'band'
        },
        secondary: {
          domain: ['dataMin', 'dataMax + 100'],
          type: 'linear',
          ticks: 8
        }
      })

</script>