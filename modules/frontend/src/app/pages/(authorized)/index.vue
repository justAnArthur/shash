<template>
  <div class="chat">
      <div style="flex:1;">
      <chat-list/>
      </div>
        <command-line/>
  </div>

</template>

<script setup>
import ChatList from 'src/app/components/chat-list.vue'
import CommandLine from 'src/app/components/command-line.vue'
</script>
<style scoped>

.chat {
  display: flex;
  flex-direction: column;
  height: 98vh;
}


</style>
