<template>
  <div class="flex h-screen w-full bg-slate-50 overflow-hidden">
    
    <aside class="w-64 bg-slate-900 text-white flex flex-col flex-shrink-0 h-full shadow-xl">
      <div class="p-6 text-xl font-black border-b border-slate-800 text-emerald-400">
        CF HOUSING
      </div>
      
      <nav class="flex-1 mt-2 overflow-y-auto overflow-x-hidden">
        <router-link 
          v-for="item in menuItems" 
          :key="item.name" 
          :to="{ name: item.name }"
          class="flex items-center px-6 py-3 hover:bg-slate-800 transition-colors border-l-4 border-transparent"
          active-class="bg-blue-600/20 border-blue-500 text-blue-400 font-bold"
        >
          <span class="mr-3">{{ item.icon }}</span>
          <span class="text-sm">{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="p-4 border-t border-slate-800">
        <button @click="handleLogout" class="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold text-white shadow-lg">
          LOGOUT 🚪
        </button>
      </div>
    </aside>

    <div class="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
      
      <header class="w-full bg-emerald-800 text-white px-6 py-4 flex justify-between items-center shadow-md flex-shrink-0">
        <h2 class="text-lg font-bold tracking-tight uppercase">{{ $route.name }}</h2>
        <div class="bg-white/10 px-4 py-1.5 rounded-full text-xs font-black border border-white/20 uppercase tracking-widest">
           👤 Admin Panel
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-6 bg-[#f0f2f5]">
        <router-view></router-view> 
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const menuItems = [
  { name: 'Dashboard', label: 'Dashboard', icon: '📊' },
  { name: 'Members', label: 'Members', icon: '👥' },
  { name: 'Monthly Billing', label: 'Monthly Billing', icon: '🗓️' },
  { name: 'Special Billing', label: 'Special Billing', icon: '🌟' },
  { name: 'Bill Collection', label: 'Bill Collection', icon: '💰' },
  { name: 'Assets', label: 'Asset Management', icon: '🏠' }, // বা '🏛️' 
  { name: 'Liability Loans', label: 'Liability & Loans', icon: '🏦' }, // বা '📉' 
  { name: 'Expenses', label: 'Expenses', icon: '💸' },
  { name: 'Reports', label: 'Reports', icon: '📈' },
  { name: 'Settings', label: 'Settings', icon: '⚙️' },
];

const handleLogout = () => {
  localStorage.removeItem('token');
  router.push('/login');
};
</script>