
import HomePage from '../pages/home.vue';
import AuthPage from '../pages/auth.vue';
import ProfileTravellerPage from '../pages/profile_traveller.vue';

var routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/auth/',
    component: AuthPage,
  },
  {
    path: '/profile_traveller/',
    component: ProfileTravellerPage,
  },
];

export default routes;
