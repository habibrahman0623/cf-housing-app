<template>
  <div class="space-y-6">
    <!-- উপরের সার্চ এবং অ্যাড বাটন সেকশন -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-sm border border-white/20">
      <div class="relative w-full md:w-80">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search by Name/ID/Phone..." 
          class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/50"
        />
      </div>
      <div class="flex justify-between items-center bg-white/80 p-4 rounded-xl shadow-sm">
        <button @click="showModal = true" class="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold">
          + Add Member
        </button>
      </div>
      <Teleport to="body">
        <div v-if="showModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          
          <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]" @click="showModal = false"></div>

          <div 
            @click.stop 
            class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col z-10 max-h-[90vh] overflow-hidden"
          >
            
            <div class="p-6 border-b border-gray-100 flex justify-center items-center bg-gray-50/50 relative">
              <h3 class="text-2xl font-extrabold text-emerald-800 tracking-tight">
                Add New Member
              </h3>
              <button 
                @click="showModal = false" 
                class="absolute right-5 top-5 text-gray-400 hover:text-red-500 transition-colors text-2xl"
              >
                &times;
              </button>
            </div>

            <div class="p-6 overflow-y-auto custom-scrollbar bg-white">
              <form @submit.prevent="addNewMember" id="memberForm" class="space-y-5">
                <div>
                  <label class="block text-sm font-semibold mb-1 text-gray-700">Full Name</label>
                  <input v-model="newMember.name" type="text" required class="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="Enter name">
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-semibold mb-1 text-gray-700">Member ID</label>
                    <input v-model="newMember.member_code" type="text" required class="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" placeholder="CF-000">
                  </div>
                  <div>
                    <label class="block text-sm font-semibold mb-1 text-gray-700">Mobile No</label>
                    <input v-model="newMember.phone" type="text" required class="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" placeholder="017xxxxxxxx">
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-semibold mb-1 text-gray-700">Email Address</label>
                  <input v-model="newMember.email" type="email" class="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" placeholder="example@mail.com">
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-semibold mb-1 text-gray-700">Shares</label>
                    <input v-model.number="newMember.share_count" type="number" required class="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500">
                  </div>
                  <div>
                    <label class="block text-sm font-semibold mb-1 text-gray-700">NID</label>
                    <input v-model="newMember.nid" type="text" class="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" placeholder="NID No">
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-semibold mb-1 text-gray-700">Address</label>
                  <input v-model="newMember.address" type="text" class="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Enter city/area">
                </div>
              </form>
            </div>

            <div class="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
              <button type="button" @click="showModal = false" class="flex-1 px-4 py-2.5 border rounded-xl font-semibold text-gray-600 hover:bg-white transition-all">
                Cancel
              </button>
              
              <button 
                form="memberForm" 
                type="submit" 
                :disabled="loading" 
                class="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 disabled:bg-emerald-300 transition-all"
              >
                {{ loading ? 'Saving...' : 'Save Member' }}
              </button>
            </div>

          </div>
        </div>
      </Teleport>
    </div>

    <!-- মেম্বার টেবিল সেকশন -->
    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto overflow-y-auto h-[calc(100vh-250px)] custom-scrollbar">
        <table class="w-full text-left border-collapse min-w-[1200px]">
          <thead class="sticky top-0 z-20 bg-slate-800 text-white">
            <tr class="bg-slate-800 text-white text-xs uppercase tracking-wider">
              <th class="px-4 py-4 font-bold">Name & ID</th>
              <th class="px-4 py-4 font-bold">Contact (Phone/Email)</th>
              <th class="px-4 py-4 font-bold">NID & Address</th>
              <th class="px-4 py-4 font-bold text-center">Shares</th>
              <th class="px-4 py-4 font-bold text-right">Balance/Due</th>
              <th class="px-4 py-4 font-bold text-right">Fine (Chg/Paid)</th>
              <th class="px-4 py-4 font-bold text-center">Status</th>
              <th class="px-4 py-4 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm">
            <tr v-for="member in filteredMembers" :key="member.id" class="hover:bg-emerald-50/30 transition-colors">
              <td class="px-4 py-4">
                <div class="font-bold text-slate-800">{{ member.name }}</div>
                <div class="text-xs text-emerald-600 font-mono">{{ member.member_code }}</div>
              </td>

              <td class="px-4 py-4">
                <div class="text-slate-700 font-medium">{{ member.phone }}</div>
                <div class="text-xs text-gray-400">{{ member.email || 'N/A' }}</div>
              </td>

              <td class="px-4 py-4">
                <div class="text-xs text-slate-600"><span class="font-bold">NID:</span> {{ member.nid || 'N/A' }}</div>
                <div class="text-xs text-gray-400 truncate w-40" :title="member.address">{{ member.address }}</div>
              </td>

              <td class="px-4 py-4 text-center font-bold text-blue-700">
                {{ member.share_count }}
              </td>

              <td class="px-4 py-4 text-right">
                <div class="text-emerald-600 font-bold">Adv: ৳{{ member.advance_balance }}</div>
                <div class="text-red-500 font-bold">Due: ৳{{ member.total_due }}</div>
              </td>

              <td class="px-4 py-4 text-right">
                <div class="text-xs text-orange-600">Charged: ৳{{ member.total_fine_charged }}</div>
                <div class="text-xs text-blue-600">Paid: ৳{{ member.total_fine_paid }}</div>
              </td>

              <td class="px-4 py-4 text-center">
                <span :class="member.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'" class="px-2 py-1 rounded-full text-[10px] font-black uppercase">
                  {{ member.status }}
                </span>
              </td>

              <td class="px-4 py-4 text-center">
                <button class="text-blue-500 hover:text-blue-700 mr-2" title="Edit">📝</button>
                <button 
                  @click="handlePayment(member)" 
                  class="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all"
                  title="Collect Money"
                >
                 Collect 💰
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="isLoading" class="p-10 text-center text-emerald-600 font-bold">
        Loading members from database...
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref,onMounted, computed } from 'vue';
import axios from 'axios';
import api from '../api';

import { usePayment } from '../composables/usePayment';

const { collectPayment } = usePayment();

const loading = ref(false);
const isLoading = ref(true);
const searchQuery = ref('');
const showModal = ref(false);
const newMember = ref({
  name: '',
  member_code: '',
  phone: '',
  email: '',
  share_count: 1,
  nid:'',
  address: ''
});
const members = ref([]);

// Backend-e data pathanor function
const addNewMember = async () => {
  loading.value = true;
  try {
    // const token = localStorage.getItem('token');
    
    // //FastAPI endpoint-e post request
    // const response = await axios.post('http://127.0.0.1:8000/members/', newMember.value, {
    //   headers: {
    //     'Authorization': `Bearer ${token}`
    //   }
    // });
    const response = await api.post('/members/',newMember.value);
    // Success hole list-e jog kora (local table-e)
    // members.value.unshift(response.data); 
    
    alert('Member added successfully!');
    showModal.value = false;
    
    // Form reset
    newMember.value = { 
      name: '', 
      member_code: '', 
      phone: '', 
      email: '', 
      share_count: 1, 
      nid: '', 
      address: '' 
    };
    await fetchMembers();
    
  } catch (err) {
    console.error(err);
    alert('Error: Could not save member. Check if server is running.');
  } finally {
    loading.value = false;
  }
};
// const filteredMembers = computed(() => {
//   return members.value.filter(m => 
//     m.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
//     m.member_id.toLowerCase().includes(searchQuery.value.toLowerCase())
//   );
// });

// ১. ডাটাবেস থেকে মেম্বার লিস্ট নিয়ে আসার ফাংশন
const fetchMembers = async () => {
  isLoading.value = true;
  try {
   // const token = localStorage.getItem('token');
    const response = await api.get('/members/members-info');
    members.value = response.data.data; // ব্যাকএন্ড থেকে আসা ডাটা সরাসরি সেভ হবে
  } catch (err) {
    console.error("Error fetching members:", err);
    alert('Could not load members. Please login again.');
  } finally {
    isLoading.value = false;
  }
};

// ২. কম্পোনেন্ট লোড হওয়ার সাথে সাথে ডাটা কল করা
onMounted(() => {
  fetchMembers();
});

// ৩. সার্চ লজিক
const filteredMembers = computed(() => {
  if (!searchQuery.value) return members.value;
  const q = searchQuery.value.toLowerCase();
  return members.value.filter(m => 
    m.name.toLowerCase().includes(q) || 
    m.member_code.toLowerCase().includes(q) ||
    m.phone.includes(q)
  );
});

const handlePayment = async (member) => {
  // মেম্বার আইডি এবং নাম পাঠিয়ে দিন
  const success = await collectPayment(member.id, member.name, member.total_due || 0);
  
  if (success) {
    // পেমেন্ট সফল হওয়ার পর যদি লিস্ট রিফ্রেশ করতে চান
    fetchMembers(); 
  }
};

</script>