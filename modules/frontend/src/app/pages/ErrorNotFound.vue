<template>
  <div class="not-found-container">
    <!-- Decorative circle -->
    <div class="circle"></div>

    <!-- Title -->
    <h1 class="title">404</h1>

    <!-- Message -->
    <p class="message">Oops! The page you’re looking for doesn’t exist.</p>

    <!-- Back Button -->
    <router-link to="/" class="back-button">
      Go Back Home
    </router-link>
  </div>
</template>

<script>
export default {
  name: "NotFound"
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #1e1e2e;
  color: #d1d5db;
}

.circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #6b7280;
  margin-bottom: 1.5rem;
}

.title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.message {
  font-size: 1.25rem;
  color: #9ca3af;
  margin-bottom: 2rem;
  text-align: center;
}

.back-button {
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  background-color: #3b82f6;
  border: none;
  border-radius: 0.25rem;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: #2563eb;
}
</style>
