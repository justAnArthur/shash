<template>
  <main id="page" class="row justify-center">
    <form class="form column flex-center shadow-2 col-10 col-sm-6 col-md-4 col-lg-2 bg-secondary self-center">
      <div class="logo column">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-square-slash">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <line x1="9" x2="15" y1="15" y2="9" />
        </svg>
      </div>
      <router-view />
    </form>
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

.form {
  background: #555;
  height: fit-content;
  border-radius: 25px;
  padding: 55px 40px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
}

.logo {
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  margin: 0 auto 24px;
  background: hsla(0, 0%, 97%, .05);
  box-shadow: inset 2px 4px 16px 0 hsla(0, 0%, 97%, .06);
  -webkit-backdrop-filter: blur(50px);
  backdrop-filter: blur(50px);
  border-radius: 50%;
}
</style>
