// Import Vue
import { createApp } from 'vue';
import { createYmaps } from 'vue-yandex-maps';

// Import Framework7
import Framework7 from 'framework7/lite-bundle';

// Import Framework7-Vue Plugin
import Framework7Vue, { registerComponents } from 'framework7-vue/bundle';

// Import Framework7 Styles
import 'framework7/css/bundle';

// Import Icons and App Custom Styles

import '../css/app.css';

// Import App Component
import App from '../components/app.vue';

// Init Framework7-Vue Plugin
Framework7.use(Framework7Vue);

// Init App
const app = createApp(App);

app.use(createYmaps({
    apikey: 'a4f4d446-8751-44b0-b2b5-12b324a8e31d',
  }));

// Register Framework7 Vue components
registerComponents(app);

// Mount the app
app.mount('#app');