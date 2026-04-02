<template>
  <div class="flex h-screen bg-gray-100">
    <aside class="w-64 bg-slate-900 text-white flex flex-col">
      <div class="p-6 text-2xl font-bold border-b border-slate-700 text-center">
        CF HOUSING
      </div>
      
      <nav class="flex-1 mt-4">
        <div v-for="item in menuItems" :key="item.name" 
             class="flex items-center px-6 py-3 cursor-pointer hover:bg-slate-700 transition-colors"
             :class="{ 'bg-blue-600': activeTab === item.name }"
             @click="activeTab = item.name">
          <span class="mr-3">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </div>
      </nav>

      <div class="p-4 border-t border-slate-700">
        <button @click="$emit('logout')" class="w-full bg-red-600 hover:bg-red-700 py-2 rounded">
          Logout
        </button>
      </div>
    </aside>

    <main class="flex-1 flex flex-col overflow-hidden">
      <header class="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">{{ activeTab }}</h2>
        <div class="flex items-center space-x-4">
          <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Secure</span>
          <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Admin</span>
        </div>
      </header>

      <section class="flex-1 overflow-y-auto p-6">
        <div v-if="activeTab === 'Dashboard'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
            <p class="text-sm text-gray-500 uppercase">Total Members</p>
            <p class="text-2xl font-bold">60</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
            <p class="text-sm text-gray-500 uppercase">Monthly Collection</p>
            <p class="text-2xl font-bold">৳ 45,000</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
            <p class="text-sm text-gray-500 uppercase">Total Due</p>
            <p class="text-2xl font-bold">৳ 12,500</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
            <p class="text-sm text-gray-500 uppercase">Fine Pending</p>
            <p class="text-2xl font-bold">৳ 1,200</p>
          </div>
        </div>
        
        <div v-else class="text-center text-gray-500 mt-20">
          {{ activeTab }} মডিউলটি তৈরির কাজ চলছে...
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const activeTab = ref('Dashboard');

const menuItems = [
  { name: 'Dashboard', label: 'Dashboard', icon: '📊' },
  { name: 'Members', label: 'Members', icon: '👥' },
  { name: 'Monthly Collection', label: 'Monthly Collection', icon: '📅' },
  { name: 'Expenses', label: 'Expenses', icon: '💸' },
  { name: 'Reports', label: 'Reports', icon: '📝' },
  { name: 'Settings', label: 'Settings', icon: '⚙️' },
];
</script>