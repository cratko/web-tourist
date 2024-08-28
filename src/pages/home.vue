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
          <p>
            Donec et nulla auctor massa pharetra adipiscing ut sit amet sem. Suspendisse molestie velit
            vitae mattis tincidunt. Ut sit amet quam mollis, vulputate turpis vel, sagittis felis.
          </p>
        </f7-block>

        <Map />
    </div>

  </f7-page>
</template>
