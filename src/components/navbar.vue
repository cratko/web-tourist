<template>
    <f7-navbar>
        <f7-nav-title><f7-block strong inset class="logo"><i class="f7-icons logo-icon">airplane</i>WebTourist</f7-block></f7-nav-title>
        <f7-nav-right>
            <f7-link href="./auth/" v-if="role == null"><i class="f7-icons logo-icon">square_arrow_right</i>
                <span class="right-span">Войти</span>
            </f7-link>
            <f7-link href="/profile_traveller/" v-if="role != null"><i class="f7-icons logo-icon">person_crop_circle</i> 
                <span class="right-span">Профиль</span>
            </f7-link>
            <f7-link href="#" v-if="role != null"><i class="f7-icons logo-icon">money_dollar_circle</i> 
                <span class="right-span">Бонусы: <span>0</span></span>
            </f7-link>
        </f7-nav-right>
        
    </f7-navbar>
    
</template>

<script setup>
import { f7 } from 'framework7-vue';
import { useCookies } from "vue3-cookies";
import {ref} from 'vue';

const { cookies } = useCookies();

const role = ref(cookies.get('role'));
</script>
