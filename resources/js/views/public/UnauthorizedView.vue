<template>
  <div class="unauthorized-container">
    <div class="error-content">
      <div class="error-code">401</div>
      <h1>Unauthorized Access</h1>
      <p>Sorry, you don't have permission to access this area.</p>
      <div class="actions">
        <router-link to="/" class="btn-primary">Return Home</router-link>
        <button @click="goBack" class="btn-secondary">Go Back</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goBack() {
  router.back();
}
</script>

<style scoped>
.unauthorized-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9faff;
  font-family: 'Syne', sans-serif;
}
.error-content {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  max-width: 500px;
  width: 90%;
}
.error-code {
  font-size: 120px;
  font-weight: 700;
  line-height: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 20px;
}
h1 {
  font-size: 28px;
  color: #333;
  margin-bottom: 15px;
}
p {
  color: #666;
  margin-bottom: 30px;
  font-size: 16px;
}
.actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 30px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}
.btn-secondary {
  background: #f1f1f1;
  color: #555;
  padding: 12px 30px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-secondary:hover {
  background: #e5e5e5;
}
</style>
