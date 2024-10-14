<template>
  <q-header class="bg-white row justify-center">
    <q-toolbar class="col-12 col-md-6 bg-grey-2 text-black">
      <q-toolbar-title>{{ chatName }}</q-toolbar-title>
    </q-toolbar>
  </q-header>
</template>

<script>
import {defineComponent} from 'vue';
export default defineComponent({
  name: 'ChatHeader',
  props: {
    chatName: {
      type: String,
      required: true
    }
  },
  setup(props) {
    return {
      chatName: props.chatName
    }
  }
})
</script>
