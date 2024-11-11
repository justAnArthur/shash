<script setup lang="ts">
  import { useAuth } from 'src/composables/useAuth'
  const { logout } = useAuth();
</script>
<template>
  <header class="header">
    <ul class="header-icons">
      <div class="header-part">
        <li class="q-btn">
          <a href="#">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 class="lucide lucide-house">
              <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
              <path
                d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
          </a>
        </li>
      </div>
      <div class="header-part">
        <li class="q-btn">
          <a href="#/settings">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="lucide lucide-settings">
              <path
                d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </a>
        </li>
        <li class="q-btn">
          <a @click="logout">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="lucide lucide-log-out">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
          </a>
        </li>
      </div>
    </ul>
  </header>
</template>

<style scoped>
.header {
  background-color: var(--color-10);
  padding: 1rem;
}

.header-part {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.header-icons {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.header-icons li {
  height: 48px;
  aspect-ratio: 1 / 1;
  border-radius: 1rem;
}

.header-icons li:before {
  border-radius: 1rem;
}

@media only screen and (max-width: 1024px) {
  .header {
    background: transparent;
    position: fixed;
    bottom: 16px;
    left: 16px;
    right: 16px;
  }

  .header-icons {
    flex-direction: row;
    position: relative;
    width: fit-content;
    margin: 0 auto;
    padding: 8px;
    background: var(--color-20);
    box-shadow: inset 2px 4px 16px 0 hsla(0, 0%, 97%, .06), 0 24px 24px -16px rgba(5, 5, 5, .09), 0 6px 13px 0 rgba(5, 5, 5, .1), 0 6px 4px -4px rgba(5, 5, 5, .1), 0 5px 1.5px -4px rgba(5, 5, 5, .25);
    -webkit-backdrop-filter: blur(50px);
    backdrop-filter: blur(50px);
    border-radius: 20px;
  }

  .header-part {
    flex-direction: row;
    gap: 0;
  }

  .q-btn {
    margin: 0 0.25rem;
  }
}
</style>
