<template>
  <main id="page">
    <header id="header">
      <ul id="header-icons">
        <li class="q-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               class="lucide lucide-house">
            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>
            <path
              d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          </svg>
        </li>
      </ul>
    </header>

    <main id="chat" style="flex: 1 1 0;">
      <div id="chat-input-wrapper">
        <textarea id="chat-input" type="text" rows="1" placeholder="Slash is /"/>
      </div>

      <div class="chat-message">
        <img src="https://xsgames.co/randomusers/avatar.php?g=pixel" alt="">
        <div style="display: grid; gap: 0.5rem">
          <div style="display: flex; gap: 0.5rem; align-items: center">
            <h2 style="font-weight: 600; line-height: 1; font-size: 16px">Arthur</h2>
            <div style="color: hsla(0, 0%, 97%, .25); line-height: 1;">09:22 AM</div>
          </div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat.
          </p>
        </div>
      </div>

      <div class="chat-message">
        <img src="https://xsgames.co/randomusers/avatar.php?g=pixel" alt="">
        <div style="display: grid; gap: 0.5rem">
          <div style="display: flex; gap: 0.5rem; align-items: center">
            <h2 style="font-weight: 600; line-height: 1; font-size: 16px">Anastasiia</h2>
            <div style="color: hsla(0, 0%, 97%, .25); line-height: 1;">03:42 PM</div>
          </div>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </p>
        </div>
      </div>
    </main>

    <aside id="chat-side">
      <ul id="chat-list">
        <li class="chat-one">
          <img src="https://xsgames.co/randomusers/avatar.php?g=pixel" alt="">
          <div style="display: grid; gap: 0.5rem">
            <div style="display: flex; gap: 0.5rem; align-items: center">
              <h2 style="font-weight: 600; line-height: 1; font-size: 16px">Arthur</h2>
              <div style="color: hsla(0, 0%, 97%, .25); line-height: 1;">1m</div>
            </div>
            <p>
              Hello from old friend...
            </p>
          </div>
        </li>
      </ul>
    </aside>
  </main>
</template>

<script>
export default {
  name: 'MainLayout'
}
</script>

<style>
#page {
  display: flex;

  height: 100vh;
  width: 100vw;
}

#header {
  background-color: rgba(40, 40, 40, .9);
  padding: 1rem;
}

#header-icons {
  display: flex;
  flex-direction: column;
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
  background-color: rgba(40, 40, 40, .8);
  padding: 1rem;

  width: 20rem;

  display: flex;
  flex-direction: column;
  gap: 1rem
}

.chat-one {
  position: relative;

  display: flex;
  gap: 1rem;

  height: fit-content;
  padding: 12px 36px 12px 12px;
  border-radius: 20px;

  background: hsla(0, 0%, 97%, .05);
  transition: background-color;

  cursor: pointer;
}

.chat-one img {
  border-radius: 999px;
  width: 3rem;
  height: 3rem;
  aspect-ratio: 1/1;
}

.chat-one:after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 20px;
  pointer-events: none;
  border: 1px solid hsla(0, 0%, 100%, .1);
  -webkit-mask-image: linear-gradient(175deg, #000, transparent 55%);
  mask-image: linear-gradient(175deg, #000, transparent 55%);
  opacity: 0;
  transition: opacity .2s;
}

.chat-one:hover:after {
  opacity: 1;
}

#chat-one:hover {
  background: hsla(0, 0%, 97%, .07);
}

#chat {
  height: 100%;
  padding: 1rem;
  background-color: rgba(40, 40, 40, .6);

  display: flex;
  flex-direction: column-reverse;
  gap: 1rem;
}

#chat-input-wrapper {
  position: relative;

  padding: 1.5rem;
  border-radius: 20px;

  background: hsla(0, 0%, 7%, .3);
}

#chat-input {
  width: 100%;
}

#chat-input:focus-visible {
  outline: none !important;
}

.chat-message {
  display: flex;
  gap: 1rem;

  padding: 12px 36px 12px 12px;
  border-radius: 20px;

  background: hsla(0, 0%, 97%, .05);

  color: hsla(0, 0%, 97%, .56);
}

.chat-message img {
  border-radius: 999px;
  min-width: 3rem;
  min-height: 3rem;
  max-width: 3rem;
  max-height: 3rem;
  aspect-ratio: 1/1;
}
</style>
