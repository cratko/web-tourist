<template>
    <f7-page name="auth">
        <f7-navbar title="Авторизация">
          <f7-nav-right>
            <f7-link href="/"><i class="f7-icons">
                multiply</i></f7-link>
          </f7-nav-right>
        </f7-navbar>
        <f7-block strong small-inset>
        <f7-login-screen v-model:opened="loginScreenOpened">

            <f7-list form>
                <f7-list-input
                  label="email"
                  type="text"
                  placeholder="test@mail.ru"
                  :value="login"
                  @input="login = $event.target.value"
                ></f7-list-input>
                <f7-list-input
                  label="Пароль"
                  type="password"
                  placeholder="test"
                  :value="password"
                  @input="password = $event.target.value"
                >
            </f7-list-input>
            <div style="padding-left: 15px; display: flex; gap: 10px">
                    <f7-toggle v-model:checked="gidLogin" />
                    <p>Войти как гид</p>
                </div>
              </f7-list>
              
              <f7-list inset>


                <div class="grid grid-cols-2 grid-gap">
                    <f7-button tonal round preloader @click="auth" :loading="isLoading">Войти</f7-button>
                    <f7-button round preloader @click="auth">Регистрация</f7-button>
                </div>
                
                
              </f7-list>

        </f7-login-screen>
    </f7-block>
    </f7-page>
</template>
  
<script>
import {
  f7Navbar,
  f7Page,
  f7LoginScreen,
  f7List,
  f7ListItem,
  f7Block,
  f7Button,
  f7LoginScreenTitle,
  f7BlockFooter,
  f7ListButton,
  f7ListInput,
  f7,
  f7ready
} from 'framework7-vue';
import { ref, onMounted } from 'vue';
import { useCookies } from "vue3-cookies";
  export default {
    props: {
      f7router: Object,
    },
    setup() {
      const { cookies } = useCookies();
      const isLoading = ref(false);
      const gidLogin = ref(false);
      return {isLoading, cookies, gidLogin};
    },
    data() {
    return {
      login: '',
      password: '',
      loginScreenOpened: true
    }
    },
    
    methods: {
      
      auth() {

        let user = {
          login: this.login,
          password: this.password
        };
        this.isLoading = true;

        if (this.gidLogin) {
            fetch('https://hack-vika.bgitu-compass.ru/auth', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => response.json() )
        .then((json) => {
          if (json.detail == "Invalid login or password") {
            f7.dialog.alert("Неправильный логин или пароль");
            this.isLoading = false;
          } else {
            this.cookies.set("access_token", json.access_token);
            this.cookies.set("role", "guide");
            f7.view.main.router.navigate("/");

            
            this.isLoading = false;
          }

      })
        } else {

        
        fetch('https://hack-koespe.bgitu-compass.ru/auth', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => response.json() )
        .then((json) => {
          if (json.detail == "Invalid login or password") {
            f7.dialog.alert("Неправильный логин или пароль");
            this.isLoading = false;
          } else {
            this.cookies.set("access_token", json.access_token);
            this.cookies.set("role", "traveller");
            f7.view.main.router.navigate("/");

            
            this.isLoading = false;
          }

      })
    }
  }}
  }
  
</script>