<template>
  <div class="p-6 bg-slate-50 min-h-screen space-y-8 font-sans">
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Members</p>
        <p class="text-4xl font-black text-indigo-600">{{ stats.active_members }}</p>
      </div>
      <div class="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Asset Value</p>
        <p class="text-4xl font-black text-slate-800">৳ {{ stats.asset_value }}</p>
      </div>
      <div class="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Liability Amount</p>
        <p class="text-4xl font-black text-rose-600">৳ {{ stats.liability_amount }}</p>
      </div>
    </div>

    <h3 class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] pl-2">Current Year Details: {{ stats.current_year }}</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <div class="bg-emerald-600 p-7 rounded-[2.5rem] text-white shadow-xl shadow-emerald-100">
        <p class="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">This Year Incomes</p>
        <p class="text-3xl font-black mb-6">৳ {{ stats.this_year_summary?.total_cash_in }}</p>
        
        <div class="space-y-3 border-t border-white/20 pt-4">
          <div v-for="(val, key) in stats.details_this_year?.income" :key="key" class="flex justify-between items-center text-[11px]">
            <span class="font-bold opacity-80 uppercase">{{ key.replace('_', ' ') }}</span>
            <span class="font-black italic text-emerald-100">৳ {{ val }}</span>
          </div>
        </div>
      </div>

      <div class="bg-rose-600 p-7 rounded-[2.5rem] text-white shadow-xl shadow-rose-100">
        <p class="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">This Year Expenses</p>
        <p class="text-3xl font-black mb-6">৳ {{ stats.this_year_summary?.total_cash_out }}</p>
        
        <div class="space-y-3 border-t border-white/20 pt-4">
          <div v-for="(val, key) in stats.details_this_year?.expense" :key="key" class="flex justify-between items-center text-[11px]">
            <span class="font-bold opacity-80 uppercase">{{ key.replace('_', ' ') }}</span>
            <span class="font-black italic text-rose-100">৳ {{ val }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white p-7 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Yearly Summary</p>
          <p class="text-3xl font-black" :class="stats.this_year_summary?.net_surplus_deficit < 0 ? 'text-rose-600' : 'text-emerald-600'">
            ৳ {{ stats.this_year_summary?.net_surplus_deficit }}
          </p>
        </div>
        <div class="bg-slate-50 p-4 rounded-2xl mt-4">
          <p class="text-[9px] font-black text-slate-400 uppercase mb-2">Cash Flow Status</p>
          <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div class="bg-emerald-500 h-full" :style="{ width: '35%' }"></div>
          </div>
          <p class="text-[10px] mt-2 font-bold text-slate-500 italic">Account is currently in deficit</p>
        </div>
      </div>
    </div>

    <h3 class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] pl-2 mt-10">Lifetime Overall Summary</h3>
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  
  <div class="bg-slate-800 p-7 rounded-[2.5rem] text-white shadow-xl shadow-slate-200">
    <p class="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1 text-emerald-400">Lifetime Incomes</p>
    <p class="text-3xl font-black mb-6 text-emerald-500">৳ {{ stats.lifetime_summary?.total_cash_in }}</p>
    
    <div class="space-y-3 border-t border-white/10 pt-4">
      <div v-for="(val, key) in stats.details_all?.income" :key="key" class="flex justify-between items-center text-[11px]">
        <span class="font-bold opacity-60 uppercase text-slate-300">{{ key.replace('_', ' ') }}</span>
        <span class="font-black italic text-emerald-400">৳ {{ val }}</span>
      </div>
    </div>
  </div>

  <div class="bg-slate-800 p-7 rounded-[2.5rem] text-white shadow-xl shadow-slate-200">
    <p class="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1 text-rose-400">Lifetime Expenses</p>
    <p class="text-3xl font-black mb-6 text-rose-500">৳ {{ stats.lifetime_summary?.total_cash_out }}</p>
    
    <div class="space-y-3 border-t border-white/10 pt-4">
      <div v-for="(val, key) in stats.details_all?.expense" :key="key" class="flex justify-between items-center text-[11px]">
        <span class="font-bold opacity-60 uppercase text-slate-300">{{ key.replace('_', ' ') }}</span>
        <span class="font-black italic text-rose-400">৳ {{ val }}</span>
      </div>
    </div>
  </div>

  <div class="bg-indigo-700 p-7 rounded-[2.5rem] text-white shadow-xl shadow-indigo-200 flex flex-col justify-center items-center text-center">
    <div class="mb-4 p-4 bg-indigo-600 rounded-full shadow-inner">
      <span class="text-3xl">💰</span>
    </div>
    <p class="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Net Fund Available</p>
    <p class="text-4xl font-black" :class="stats.lifetime_summary?.net_fund_available < 0 ? 'text-rose-300' : 'text-emerald-300'">
      ৳ {{ stats.lifetime_summary?.net_fund_available }}
    </p>
    <p class="text-[9px] mt-4 font-bold uppercase tracking-widest opacity-50 border border-white/20 px-4 py-1 rounded-full">
      Final Balance Sheet
    </p>
  </div>

</div>
    
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';

const stats = ref({});

const fetchDashboardData = async () => {
  try {
    const res = await api.get('/reports/dashboard-summary');
    stats.value = res.data;
  } catch (err) {
    console.error("Dashboard Load Error:", err);
  }
};

onMounted(fetchDashboardData);
</script>