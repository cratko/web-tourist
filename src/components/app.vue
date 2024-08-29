<template>
  <f7-app v-bind="f7params">

  <!-- Your main view, should have "view-main" class -->
  <f7-view main class="safe-areas" url="/"></f7-view>

  </f7-app>
</template>
<script>
  import { ref, onMounted } from 'vue';
  import { f7, f7ready } from 'framework7-vue';


  import routes from '../js/routes.js';

  export default {
    setup() {

      // Framework7 Parameters
      const f7params = {
        name: 'WebTourist', // App name
        theme: 'auto', // Automatic theme detection
        colors: {
          primary: '#f3fb05',
        },

        // App routes
        routes: routes,

        // Register service worker (only on production build)
        serviceWorker: process.env.NODE_ENV ==='production' ? {
          path: '/service-worker.js',
        } : {},
      };

      onMounted(() => {
        f7ready(() => {


          // Call F7 APIs here
        });
      });

      return {
        f7params,

      }
    }
  }
</script>