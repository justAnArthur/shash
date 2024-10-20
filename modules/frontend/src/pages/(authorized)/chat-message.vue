<template>
  <div class="chat-message">
    <img class="avatar" src="https://xsgames.co/randomusers/avatar.php?g=male" alt="">
    <div style="display: grid; gap: 0.5rem">
      <div style="display: flex; gap: 0.5rem; align-items: center">
        <h2 style="font-weight: 600; line-height: 1; font-size: 16px">{{ user.name }}</h2>
        <div style="color: hsla(0, 0%, 97%, .25); line-height: 1;">{{ formattedTime }}</div>
      </div>
      <p>{{ content }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'chat-message',

  props: {
    user: {
      name: {
        type: String,
        required: true
      }
    },
    createdAt: {
      type: Date,
      required: true
    },

    content: {
      type: String,
      required: true
    }
  },

  computed: {
    formattedTime() {
      return this.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }
}
</script>

<style scoped>
.chat-message {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 20px;
  background: hsla(0, 0%, 97%, .05);
  color: hsla(0, 0%, 97%, .56);
}

#chat-header h1 {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.5rem;
}

#chat-header img {
  border-radius: 999px;
  min-width: 3rem;
  min-height: 3rem;
  max-width: 3rem;
  max-height: 3rem;
  aspect-ratio: 1/1;
}
</style>
