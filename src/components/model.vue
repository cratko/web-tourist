<template>
  <div>
    <div v-html="iframeCode"></div>
  </div>
</template>
<script setup>
import {ref } from 'vue';

const stl_url = defineModel('stl_url');
const iframeCode =  ref('<iframe width="620" height="300px" style="border:1px solid #eeeeee;" src="https://3dviewer.net/embed.html#model=' + stl_url.value + '$camera=-52.91876,164.05697,120.34852,21.36937,65.00612,-28.22775,0.00000,1.00000,0.00000,45.00000$projectionmode=perspective$envsettings=fishermans_bastion,off$backgroundcolor=255,255,255,255$defaultcolor=200,200,200$defaultlinecolor=100,100,100$edgesettings=off,0,0,0,1"></iframe>');

</script>
