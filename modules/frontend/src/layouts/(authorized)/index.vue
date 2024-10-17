<template>
  <main id="page">
    <header id="header">
      <ul id="header-icons">
        <li class="q-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-house">
            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
            <path
              d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        </li>
        <li class="q-btn">
          <a href="#/auth/login">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="lucide lucide-log-out">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
          </a>
        </li>
      </ul>
    </header>

    <main id="chat" style="flex: 1 1 0;">
      <router-view />
    </main>

    <aside id="chat-side">
      <chat-list />
    </aside>
  </main>
</template>

<script setup>
import ChatList from 'src/components/chat-list.vue'
</script>

<style>
#page {
  display: flex;
  height: 100vh;
  width: 100vw;
}

#header {
  background-color: var(--color-10);
  padding: 1rem;
}

#header-icons {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  gap: 1rem;
}

#header-icons li {
  height: 48px;
  aspect-ratio: 1 / 1;
  border-radius: 1rem;
}

#header-icons li:before {
  border-radius: 1rem;
}

#chat-side {
  background-color: var(--color-10);
  padding: 1rem;
  width: 20rem;
  display: flex;
  flex-direction: column;
  gap: 1rem
}

#chat {
  height: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column-reverse;
  gap: 1rem;
}
</style>
