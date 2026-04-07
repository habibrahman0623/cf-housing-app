<template>
  <div id="app-container">
    <!-- লগইন না থাকলে এই সেকশনটি দেখাবে -->
    <div v-if="!isLoggedIn" class="login-wrapper">
      <div class="login-card">
        <h1 class="text-2xl font-bold mb-6 text-gray-800">CF Housing Login</h1>
        <div class="space-y-4">
          <input v-model="loginData.username" placeholder="Username" class="login-input" />
          <input v-model="loginData.password" type="password" placeholder="Password" class="login-input" />
          <button @click="handleLogin" class="login-button">Login</button>
        </div>
        <p v-if="error" class="error-msg">{{ error }}</p>
      </div>
    </div>
    
    <!-- লগইন থাকলে সরাসরি ড্যাশবোর্ড লেআউট, কোনো মার্জিন বা হেডার ছাড়াই -->
    <div v-else class="h-screen overflow-hidden">
      <DashboardLayout @logout="logout" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import DashboardLayout from './components/DashboardLayout.vue';

const isLoggedIn = ref(!!localStorage.getItem('token'));
const error = ref('');
const loginData = ref({ username: '', password: '' });

const handleLogin = async () => {
  try {
    const formData = new FormData();
    formData.append('username', loginData.value.username);
    formData.append('password', loginData.value.password);

    const response = await axios.post('http://127.0.0.1:8000/auth/login', formData);
    
    localStorage.setItem('token', response.data.access_token);
    isLoggedIn.value = true;
    error.value = '';
  } catch (err) {
    error.value = 'Login Failed! Check username/password.';
  }
};

const logout = () => {
  localStorage.removeItem('token');
  isLoggedIn.value = false;
};
</script>

<style>
/* পুরো স্ক্রিন দখল করার জন্য */
html, body, #app, #app-container {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

/* লগইন পেজের সুন্দর স্টাইল */
.login-wrapper {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
}

.login-card {
  background: white;
  padding: 2.5rem;
  border-radius: 1rem;
  shadow: 0 10px 25px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-input {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box; /* ইনপুট বক্সের সাইজ ঠিক রাখতে */
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.error-msg {
  color: #ef4444;
  margin-top: 15px;
  font-size: 0.9rem;
}
</style>