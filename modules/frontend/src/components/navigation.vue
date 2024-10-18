<template>
  <header class="header">
    <ul class="header-icons">
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
</template>

<style scoped>
.header {
  background-color: var(--color-10);
  padding: 1rem;
}

.header-icons {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  gap: 1rem;
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
    gap: 8px;
    padding: 8px;
    background: var(--color-20);
    box-shadow: inset 2px 4px 16px 0 hsla(0, 0%, 97%, .06), 0 24px 24px -16px rgba(5, 5, 5, .09), 0 6px 13px 0 rgba(5, 5, 5, .1), 0 6px 4px -4px rgba(5, 5, 5, .1), 0 5px 1.5px -4px rgba(5, 5, 5, .25);
    -webkit-backdrop-filter: blur(50px);
    backdrop-filter: blur(50px);
    border-radius: 20px;
  }

}
</style>
