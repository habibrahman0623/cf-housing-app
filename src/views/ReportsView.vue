<template>
  <div class="p-6 bg-slate-50 min-h-screen space-y-6 pb-20 font-sans">
    
    <div class="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
      <div>
        <h2 class="text-2xl font-black text-slate-800 uppercase tracking-tighter">CF Housing Reports</h2>
        <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest">Advanced Financial Tracking & Audit</p>
      </div>
      <div class="flex gap-3">
        <button @click="exportToExcel" class="bg-emerald-50 text-emerald-600 border border-emerald-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-600 hover:text-white transition-all">Excel</button>
        <button @click="exportToPDF" class="bg-rose-50 text-rose-600 border border-rose-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-rose-600 hover:text-white transition-all">PDF Report</button>
      </div>
    </div>

    <div class="flex gap-4 border-b border-slate-200">
      <button v-for="t in ['monthly', 'special', 'defaulters', 'history','expenses']" :key="t" 
        @click="activeTab = t"
        :class="activeTab === t ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'"
        class="pb-4 px-4 text-[11px] font-black uppercase tracking-widest border-b-4 transition-all">
        {{ t === 'expenses' ? 'Expense History' : (t === 'history' ? 'Collection History' : t + ' Summary') }}
      </button>
    </div>

    <div v-if="activeTab === 'history' || activeTab === 'expenses'" class="bg-indigo-50/50 p-4 rounded-3xl border border-indigo-100 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <span class="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Select Date Range:</span>
        <div class="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm">
          <input type="date" v-model="dateFilters.start_date" class="text-xs font-bold text-slate-600 border-none p-0 focus:ring-0">
          <span class="text-slate-300 font-black px-2">→</span>
          <input type="date" v-model="dateFilters.end_date" class="text-xs font-bold text-slate-600 border-none p-0 focus:ring-0">
        </div>
      </div>
      <button @click="activeTab === 'history' ? fetchCollectionHistory() : fetchExpenseHistory()" class="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:shadow-lg hover:shadow-indigo-200 transition-all">
        Fetch Records
      </button>
    </div>

    <div v-if="loading" class="py-20 text-center text-slate-300 font-black uppercase tracking-widest animate-pulse">
      Generating Report...
    </div>

    <div v-else class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
      <table v-if="activeTab === 'monthly'" id="report-table" class="w-full text-left">
        <thead class="bg-slate-800 text-[9px] font-black uppercase text-slate-400 border-b">
          <tr><th class="px-8 py-5">Period</th><th class="px-8 py-5 text-right">Target</th><th class="px-8 py-5 text-right">Collected</th><th class="px-8 py-5 text-right">Due</th><th class="px-8 py-5 text-center">Status</th></tr>
        </thead>
        <tbody class="text-sm">
          <tr v-for="(row, idx) in monthlyData" :key="row.month" 
              :class="idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'" 
              class="hover:bg-indigo-50/50 transition-colors border-b border-slate-50">
            <td class="px-8 py-5 font-black text-slate-700 uppercase">{{ row.month }}</td>
            <td class="px-8 py-5 text-right font-bold">৳ {{ row.total_bill }}</td>
            <td class="px-8 py-5 text-right font-bold text-green-600">৳ {{ row.total_collected }}</td>
            <td class="px-8 py-5 text-right font-bold text-rose-500">৳ {{ row.total_due }}</td>
            <td class="px-8 py-5 text-center"><span class="px-3 py-1 bg-white border border-slate-100 rounded-full text-[10px] font-black shadow-sm">{{ row.performance }}</span></td>
          </tr>
        </tbody>
      </table>

      <table v-if="activeTab === 'special'" id="report-table" class="w-full text-left">
        <thead class="bg-slate-800 text-[9px] font-black uppercase text-slate-400 border-b">
          <tr><th class="px-8 py-5">Bill Name</th><th class="px-8 py-5 text-right">Total</th><th class="px-8 py-5 text-right">Collected</th><th class="px-8 py-5 text-right">Outstanding</th></tr>
        </thead>
        <tbody class="text-sm">
          <tr v-for="(row, idx) in specialData" :key="row.bill_name" 
              :class="idx % 2 === 0 ? 'bg-white' : 'bg-emerald-50/30'"
              class="hover:bg-emerald-50/50 transition-colors border-b border-slate-50">
            <td class="px-8 py-5 font-black text-slate-700 uppercase">{{ row.bill_name }}</td>
            <td class="px-8 py-5 text-right font-bold">৳ {{ row.total_bill }}</td>
            <td class="px-8 py-5 text-right font-bold text-emerald-600">৳ {{ row.total_collected }}</td>
            <td class="px-8 py-5 text-right font-bold text-orange-500">৳ {{ row.total_due }}</td>
          </tr>
        </tbody>
      </table>

      <table v-if="activeTab === 'defaulters'" id="report-table" class="w-full text-left">
        <thead class="bg-slate-800 text-[9px] font-black uppercase text-slate-400 border-b">
          <tr><th class="px-8 py-5">Member</th><th class="px-8 py-5 text-right">Monthly</th><th class="px-8 py-5 text-right">Special</th><th class="px-8 py-5 text-right">Grand Total</th></tr>
        </thead>
        <tbody class="text-sm">
          <tr v-for="(d, idx) in defaulterData" :key="d.Id" 
              :class="idx % 2 === 0 ? 'bg-white' : 'bg-rose-50/30'"
              class="hover:bg-rose-50/60 transition-colors border-b border-slate-50">
            <td class="px-8 py-5">
              <p class="font-black text-slate-800 uppercase leading-none">{{ d.Name }}</p>
              <span class="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{{ d['Member Code'] }}</span>
            </td>
            <td class="px-8 py-5 text-right font-bold text-slate-600">৳ {{ d['Monthly Due'] }}</td>
            <td class="px-8 py-5 text-right font-bold text-slate-600">৳ {{ d['Special Due'] }}</td>
            <td class="px-8 py-5 text-right font-black text-rose-600">৳ {{ d['Total Due'] }}</td>
          </tr>
        </tbody>
      </table>

      <table v-if="activeTab === 'history'" id="report-table" class="w-full text-left">
        <thead class="bg-slate-800 text-[9px] font-black uppercase text-slate-400 border-b">
          <tr><th class="px-8 py-5">Receipt & Date</th><th class="px-8 py-5">Member Name</th><th class="px-8 py-5 text-right">Amount</th><th class="px-8 py-5 text-center">Method</th></tr>
        </thead>
        <tbody class="text-sm">
          <tr v-for="(t, idx) in collectionHistory" :key="t.receipt_no" 
              :class="idx % 2 === 0 ? 'bg-white' : 'bg-indigo-50/40'"
              class="hover:bg-indigo-100/50 transition-colors border-b border-slate-50">
            <td class="px-8 py-5">
              <p class="font-black text-slate-800 uppercase leading-none">#{{ t.receipt_no }}</p>
              <span class="text-[9px] font-bold text-slate-400">{{ t.date }}</span>
            </td>
            <td class="px-8 py-5 italic font-medium text-slate-600">{{ t.member_name }} <span class="text-[10px] opacity-50 font-sans">({{ t.member_code }})</span></td>
            <td class="px-8 py-5 text-right font-black text-indigo-600">৳ {{ t.amount }}</td>
            <td class="px-8 py-5 text-center uppercase text-[10px] font-black text-slate-400">{{ t.method }}</td>
          </tr>
          <tr v-if="collectionHistory.length > 0" class="bg-slate-900 text-white font-black">
            <td colspan="2" class="px-8 py-6 text-right uppercase text-[10px] tracking-widest">Total Period Collection:</td>
            <td class="px-8 py-6 text-right text-lg">৳ {{ historySummary.total_collected }}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <table v-if="activeTab === 'expenses'" id="report-table" class="w-full text-left table-fixed"> <thead class="bg-amber-800 text-[9px] font-black uppercase text-amber-200 border-b">
    <tr>
      <th class="px-8 py-5 w-1/4">Date & Category</th> <th class="px-8 py-5 w-1/2">Description</th>   <th class="px-8 py-5 text-right w-1/4">Amount</th> </tr>
  </thead>
  <tbody class="text-sm">
    <tr v-for="(e, idx) in expenseHistory" :key="e.id" 
        :class="idx % 2 === 0 ? 'bg-white' : 'bg-amber-50/40'"
        class="hover:bg-amber-100/50 transition-colors border-b border-slate-50">
      
      <td class="px-8 py-5">
        <p class="font-black text-slate-800 uppercase leading-none">{{ e.category }}</p>
        <span class="text-[9px] font-bold text-slate-400">{{ e.date }}</span>
      </td>

      <td class="px-8 py-5 text-slate-600 italic whitespace-normal break-words">
        {{ e.description }}
      </td>

      <td class="px-8 py-5 text-right font-black text-rose-600">
        ৳ {{ e.amount }}
      </td>
    </tr>
  </tbody>
</table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const activeTab = ref('monthly');
const loading = ref(false);

const collectionStats = ref({});
const monthlyData = ref([]);
const specialData = ref([]);
const defaulterData = ref([]);
const collectionHistory = ref([]);
const historySummary = ref({});

const dateFilters = ref({
  start_date: new Date().toISOString().substr(0, 10),
  end_date: new Date().toISOString().substr(0, 10)
});

const fetchAllData = async () => {
  loading.value = true;
  try {
    const [monthlyRes, specialRes, defaulterRes] = await Promise.all([
      //api.get('/reports/dashboard-summary'),
      api.get('/reports/all-monthly-summary'),
      api.get('/reports/all-special-summary'),
      api.get('/reports/defaulter-list')
    ]);
    //collectionStats.value = dashRes.data.collection_summary;
    monthlyData.value = monthlyRes.data;
    specialData.value = specialRes.data;
    defaulterData.value = defaulterRes.data.defaulters;
    
    // Initial fetch for history
    await fetchCollectionHistory();
    await fetchExpenseHistory(); 
  } catch (err) {
    console.error("Fetch Error:", err);
  } finally {
    loading.value = false;
  }
};

const fetchCollectionHistory = async () => {
  try {
    const res = await api.get('/reports/collection-history', { params: dateFilters.value });
    collectionHistory.value = res.data.data;
    historySummary.value = res.data.report_info;
  } catch (err) {
    console.error("History Fetch Error:", err);
  }
};

const exportToExcel = () => {
  let data = [];
  if (activeTab.value === 'monthly') data = monthlyData.value;
  else if (activeTab.value === 'special') data = specialData.value;
  else if (activeTab.value === 'defaulters') data = defaulterData.value;
  else data = collectionHistory.value;

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Report");
  XLSX.writeFile(wb, `${activeTab.value}_report.xlsx`);
};

const exportToPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text(`${activeTab.value.toUpperCase()} REPORT`, 14, 15);
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);

  doc.autoTable({
    html: '#report-table',
    startY: 30,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], fontSize: 7 },
    styles: { fontSize: 7 }
  });
  doc.save(`${activeTab.value}_report.pdf`);
};

onMounted(fetchAllData);
const expenseHistory = ref([]);
const expenseSummary = ref({});

const fetchExpenseHistory = async () => {
  try {
    const res = await api.get('/reports/expense-history', { params: dateFilters.value });
    expenseHistory.value = res.data.data;
    expenseSummary.value = res.data.report_info;
  } catch (err) {
    console.error("Expense Fetch Error:", err);
  }
};


</script>