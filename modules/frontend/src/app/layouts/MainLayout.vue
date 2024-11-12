<template>
  <q-layout view="lHh Lpr lFf" class="bg-dark">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'MainLayout'

})
</script>
