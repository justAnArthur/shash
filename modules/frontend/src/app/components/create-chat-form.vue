<template>
  <form class="create-chat-form">
    <div class="input-group">
      <input class="input-field" type="text" placeholder="Chat name" />
    </div>
    <div class="input-group-checkbox">
      <label for="private" class="checkbox-label">Private</label>
      <input class="input-checkbox" type="checkbox" name="private" value="private" id="private" />
    </div>
    <button class="q-btn create-btn" type="button" @click="createChat">Create</button>
  </form>
</template>
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
}

.checkbox-label {
  color: hsla(0, 0%, 100%, .56);
  font-size: 1rem;
}

.input-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  background-color: var(--color-20);
  border-radius: 4px;
  border: 1px solid var(--color-10);
}

@media only screen and (max-width :1024px) {
  .create-chat-form {
    max-width: 100%;
    align-items: center;
    margin: 0 auto;
  }
}
</style>
