<script>
import Navbar from '../components/navbar.vue';
import Map from '../components/map.vue';

export default {
  components: {
    Navbar,
    Map
  },
}
</script>

<template>
  <f7-page name="home">
    <!-- Top Navbar -->
    <Navbar/>

    <div class="grid grid-cols-2 grid-gap">
        
        <f7-block strong inset>

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
                <f7-block>
                  
                </f7-block>
              </f7-tab>
              <f7-tab id="tab-2" class="page-content">
                <f7-block>
                 
                </f7-block>
              </f7-tab>
            </f7-tabs>
    </f7-block>

    <f7-block strong inset>
      <Map />
    </f7-block>
        
    </div>

  </f7-page>
</template>
