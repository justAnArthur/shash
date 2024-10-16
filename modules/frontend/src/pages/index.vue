<template>
  <q-page id="index-page" class="flex flex-center">
    <command-line/>
  </q-page>
</template>

<script setup lang="ts">
import CommandLine from "../components/command-line.vue"
</script>

<style scoped>
#index-page {
  max-width: 60ch;
  margin-left: auto;
  margin-right: auto;
}
</style>
