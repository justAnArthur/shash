<template>
  <main>
    <div id="select-chat">
      Select chat
    </div>

    <command-line/>
  </main>
</template>

<script setup lang="ts">
import CommandLine from "src/app/components/command-line.vue"
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  height: 100%;
}

#select-chat {
  flex: 1 1 0%;
  display: grid;
  place-content: center;
}
</style>
