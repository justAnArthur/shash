<template>
  <main id="page" class="row justify-center bg-dark">
      <div class="background"/>
      <form class="form column flex-center shadow-2 col-10 col-sm-6 col-md-4 col-lg-2 bg-secondary self-center">
        <div class="logo column"/>
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
.form{
  height: fit-content;
  border-radius: 25px;
  padding: 55px 40px;
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
.background {
    position: fixed;
    inset: 0;
}
</style>
