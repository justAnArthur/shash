<template>
  <form class="create-chat-form">
    <div class="input-group">
      <input class="input-field" type="text" placeholder="Chat name" v-model="chatName"/>
    </div>
    <div class="input-group-checkbox">
      <label for="private" class="checkbox-label">Private</label>
      <input class="input-checkbox" type="checkbox" name="private" v-model="isPrivate" id="private"/>
    </div>
    <button class="q-btn create-btn" type="button" @click="createChat">Create</button>
  </form>
</template>
<script setup lang="ts">
  import { ref, defineProps } from 'vue'
  import { updateChatMine } from "src/app/components/chat-list.store";
  import { useRouter } from 'vue-router'
  import { api } from "boot/axios";
  const props = defineProps<{
    onSubmit: Function;
  }>()
  const router = useRouter()
  const chatName = ref('')
  const isPrivate = ref(false)

    const createChat = async () => {
      try {
        console.log(props)
        const response = await api.put('/chat/create', { chatName: chatName.value, isPrivate: isPrivate.value })
        props.onSubmit(response.data)
        updateChatMine()
        router.push('/chats/' + response.data.chat.id)
        console.log('Chat created successfully:', response.data)
      } catch (error) {
        console.error('Error creating chat:', error)
      }
    }
</script>

<style scoped>
/* TODO: checkbox style refactor */
.create-chat-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: var(--color-30);
  padding: 1rem;
  border-radius: 20px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  max-width: 20rem;
}

.input-group {
  position: relative;
}

.input-field {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--color-20);
  border: 1px solid var(--color-10);
  border-radius: 6px;
  color: hsla(0, 0%, 100%, .56);
  font-size: 1rem;
}

.input-field::placeholder {
  color: hsla(0, 0%, 100%, .56);
}

.input-group-checkbox {
  padding-left: 12px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer; /* Ensures the checkbox is clickable when the user clicks anywhere in the label */
}

.checkbox-label {
  display: flex;
  align-items: center;
  color: hsla(0, 0%, 100%, .56);
  font-size: 1rem;
  cursor: pointer; /* Allow the label to be clicked too */
}

.input-checkbox {
  width: 1.5rem;
  height: 1.5rem;
  background-color: var(--color-20);
  border-radius: 4px;
  border: 1px solid var(--color-10);
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

/* Style when the checkbox is checked */
.input-checkbox:checked {
  background-color: var(--color-10);
  border-color: var(--color-30);
}

.input-checkbox:checked::before {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 2px;
}

@media only screen and (max-width: 1024px) {
  .create-chat-form {
    max-width: 100%;
    align-items: center;
    margin: 0 auto;
  }
}
</style>
