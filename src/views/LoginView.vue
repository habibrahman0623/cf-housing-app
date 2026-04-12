<template>
  <div class="login-wrapper">
    <div class="login-card">
      <!-- লোগো বা টাইটেল -->
      <div class="mb-8">
        <div class="text-4xl mb-2">🏢</div>
        <h1 class="text-2xl font-black text-slate-800 tracking-tight uppercase">
          CF Housing <span class="text-emerald-600">Login</span>
        </h1>
        <p class="text-sm text-gray-500 mt-1">Enter your credentials to access dashboard</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div class="text-left">
          <label class="block text-xs font-bold text-gray-600 uppercase ml-1 mb-1">Username</label>
          <input 
            v-model="loginData.username" 
            type="text" 
            placeholder="e.g. admin" 
            class="login-input focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            required
          />
        </div>

        <div class="text-left">
          <label class="block text-xs font-bold text-gray-600 uppercase ml-1 mb-1">Password</label>
          <input 
            v-model="loginData.password" 
            type="password" 
            placeholder="••••••••" 
            class="login-input focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            required
          />
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="login-button flex items-center justify-center gap-2"
        >
          <span v-if="isLoading" class="animate-spin text-xl">⏳</span>
          {{ isLoading ? 'Authenticating...' : 'Sign In to Dashboard' }}
        </button>
      </form>

      <p v-if="error" class="error-msg bg-red-50 p-3 rounded-lg border border-red-100">
        {{ error }}
      </p>

      <div class="mt-8 pt-6 border-t border-gray-100 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
        Powered by CF Housing Management System
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const error = ref('');
const isLoading = ref(false);
const loginData = ref({ username: '', password: '' });

const handleLogin = async () => {
  isLoading.value = true;
  error.value = '';

  try {
    const formData = new FormData();
    formData.append('username', loginData.value.username);
    formData.append('password', loginData.value.password);

    const response = await axios.post('http://127.0.0.1:8000/auth/login', formData);
    
    // টোকেন সেভ করা
    localStorage.setItem('token', response.data.access_token);
    
    // সরাসরি ড্যাশবোর্ডে রিডাইরেক্ট করা
    router.push('/dashboard');
    
  } catch (err) {
    if (err.response && err.response.status === 401) {
      error.value = 'Invalid username or password!';
    } else {
      error.value = 'Connection error! Is the backend running?';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-wrapper {
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
}

.login-card {
  background: white;
  padding: 3rem 2.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 420px;
  text-align: center;
}

.login-input {
  width: 100%;
  padding: 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  box-sizing: border-box;
  font-size: 1rem;
}

.login-button {
  width: 100%;
  padding: 14px;
  background-color: #10b981; /* Emerald-500 */
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.4);
}

.login-button:hover {
  background-color: #059669;
  transform: translateY(-1px);
}

.login-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.error-msg {
  color: #ef4444;
  margin-top: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}
</style>