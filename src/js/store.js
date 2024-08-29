
import { createStore } from 'framework7/lite';
import './geolocation.js';
import getLocationFromUser from './geolocation.js';

const store = createStore({
  state: {
    currentLocation: [ await getLocationFromUser() ]
  },
  getters: {
    getCurrentLocation({ state }) {
      console.log(state.currentLocation)
      return state.currentLocation;
    }
  },
})
export default store;
