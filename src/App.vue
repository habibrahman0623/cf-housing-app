<template>
  <div id="app">
    <h1>CF Housing Management</h1>
    <hr />
    <div v-if="!isLoggedIn">
      <h3>Login</h3>
      <input v-model="loginData.username" placeholder="Username" /><br /><br />
      <input v-model="loginData.password" type="password" placeholder="Password" /><br /><br />
      <button @click="handleLogin">Login</button>
      <p v-if="error" style="color: red;">{{ error }}</p>
    </div>
    
    <div v-else>
      <DashboardLayout @logout="isLoggedIn = false" />
      <!-- <h3>Welcome, You are Logged In!</h3>
      <button @click="logout">Logout</button> -->
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
    // FastAPI ডিফল্টভাবে form-data হিসেবে ইউজারনেম পাসওয়ার্ড নেয়
    const formData = new FormData();
    formData.append('username', loginData.value.username);
    formData.append('password', loginData.value.password);

    const response = await axios.post('http://127.0.0.1:8000/auth/login', formData);
    
    // টোকেন সেভ করে রাখা
    localStorage.setItem('token', response.data.access_token);
    isLoggedIn.value = true;
    error.value = '';
    alert('Login Success!');
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
#app { font-family: sans-serif; text-align: center; margin-top: 50px; }
input { padding: 10px; width: 250px; }
button { padding: 10px 20px; cursor: pointer; background-color: #4CAF50; color: white; border: none; }
</style>