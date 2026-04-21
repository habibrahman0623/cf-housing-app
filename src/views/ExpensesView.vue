<template>
  <div class="p-6 h-screen flex flex-col space-y-6 overflow-hidden">
    
    <div class="flex justify-between items-center shrink-0">
      <div>
        <h2 class="text-2xl font-black text-slate-800 uppercase tracking-tight">Expense Management</h2>
        <p class="text-xs text-gray-500 font-bold">সংস্থার দৈনন্দিন এবং সম্পদ সংক্রান্ত খরচসমূহ</p>
      </div>
      <button @click="openAddModal" class="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-red-100 flex items-center gap-2">
        <span class="text-xl">+</span> Add New Expense
      </button>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col flex-grow overflow-hidden">
      <div class="overflow-y-auto overflow-x-auto h-full custom-scrollbar relative">
        <table class="w-full text-left border-separate border-spacing-0 min-w-[900px]">
          <thead>
            <tr>
              <th class="sticky top-0 z-30 bg-slate-50 border-b border-slate-200 px-6 py-4 text-[10px] uppercase text-slate-500 font-black tracking-widest">Date</th>
              <th class="sticky top-0 z-30 bg-slate-50 border-b border-slate-200 px-6 py-4 text-[10px] uppercase text-slate-500 font-black tracking-widest">Category</th>
              <th class="sticky top-0 z-30 bg-slate-50 border-b border-slate-200 px-6 py-4 text-[10px] uppercase text-slate-500 font-black tracking-widest">Description</th>
              <th class="sticky top-0 z-30 bg-slate-50 border-b border-slate-200 px-6 py-4 text-[10px] uppercase text-slate-500 font-black tracking-widest text-right">Amount</th>
              <th class="sticky top-0 z-30 bg-slate-50 border-b border-slate-200 px-6 py-4 text-[10px] uppercase text-slate-500 font-black tracking-widest text-center">Receipt</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm">
            <tr v-for="exp in expenses" :key="exp.id" class="hover:bg-slate-50/50 transition-colors">
              <td class="px-6 py-4 font-medium text-slate-700">{{ formatDate(exp.expense_date) }}</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">{{ exp.category }}</span>
                <div v-if="exp.asset_name" class="text-[9px] text-indigo-500 mt-1 font-bold italic">Asset: {{ exp.asset_name }}</div>
              </td>
              <td class="px-6 py-4 text-slate-500 italic max-w-xs truncate">{{ exp.description }}</td>
              <td class="px-6 py-4 text-right font-black text-red-600">৳ {{ exp.amount }}</td>
              <td class="px-6 py-4 text-center">
                <button v-if="exp.document_path" @click="downloadDoc(exp)" class="p-2 bg-slate-100 hover:bg-slate-800 hover:text-white rounded-lg transition-all">📄</button>
                <span v-else class="text-gray-300 text-xs">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showAddModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showAddModal = false"></div>
        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg z-10 overflow-hidden flex flex-col max-h-[90vh]">
          
          <div class="bg-red-600 p-5 text-white flex justify-between items-center shrink-0">
            <div>
              <h3 class="text-lg font-black uppercase italic">Record New Expense</h3>
              <p class="text-[10px] opacity-80">সঠিক তথ্য দিয়ে খরচের এন্ট্রি সম্পন্ন করুন</p>
            </div>
            <button @click="showAddModal = false" class="text-xl">✕</button>
          </div>

          <div class="p-8 space-y-5 overflow-y-auto custom-scrollbar">
            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-1">
                <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Expense Category</label>
                <select v-model="form.category" class="w-full px-4 py-3 border-2 border-slate-100 rounded-xl outline-none focus:border-red-500 font-bold text-sm transition-all">
                  <option value="Maintenance">Asset Maintenance</option>
                  <option value="Utility">Utility Bill</option>
                  <option value="Salary">Staff Salary</option>
                  <option value="Purchase">New Purchase</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div class="col-span-1">
                <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Link Asset</label>
                <select v-model="form.asset_id" class="w-full px-4 py-3 border-2 border-slate-100 rounded-xl outline-none focus:border-red-500 font-bold text-sm transition-all">
                  <option :value="null" :disabled="form.category === 'Maintenance'">
                    {{ form.category === 'Maintenance' ? '-- Select Asset --' : 'No Asset' }}
                  </option>
                  <option v-for="asset in assets" :key="asset.id" :value="asset.id">{{ asset.name }}</option>
                </select>
                <p v-if="form.category === 'Maintenance' && !form.asset_id" class="text-[9px] text-red-500 font-bold mt-1">
                    * Asset selection is required for maintenance.
                </p>
              </div>

              <div class="col-span-1">
                <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Amount (৳)</label>
                <input v-model="form.amount" type="number" class="w-full px-4 py-3 border-2 border-slate-100 rounded-xl outline-none focus:border-red-500 font-bold">
              </div>

              <div class="col-span-1">
                <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Expense Date</label>
                <input v-model="form.expense_date" type="date" class="w-full px-4 py-3 border-2 border-slate-100 rounded-xl outline-none focus:border-red-500 font-bold">
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Payment Method</label>
              <select v-model="form.payment_method" class="w-full px-4 py-3 border-2 border-slate-100 rounded-xl outline-none focus:border-red-500 font-bold text-sm">
                <option value="Cash">Cash</option>
                <option value="Bank">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Description</label>
              <textarea v-model="form.description" rows="2" class="w-full px-4 py-3 border-2 border-slate-100 rounded-xl outline-none focus:border-red-500 text-sm" placeholder="খরচের বিবরণ লিখুন..."></textarea>
            </div>

            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Attach Receipt</label>
              <input @change="handleFileUpload" type="file" class="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-red-50 file:text-red-700 cursor-pointer">
            </div>
          </div>

          <div class="p-6 bg-slate-50 border-t flex gap-3 shrink-0">
            <button @click="showAddModal = false" class="flex-1 py-3 text-sm font-bold text-gray-400 uppercase">Cancel</button>
            <button @click="submitExpense" class="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-200 uppercase">Save Expense</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';

const expenses = ref([]);
const assets = ref([]);
const showAddModal = ref(false);

const form = ref({
  category: 'Maintenance',
  amount: 0,
  description: '',
  asset_id: null,
  payment_method: 'Cash',
  expense_date: new Date().toISOString().substr(0, 10),
  file: null
});

const fetchExpenses = async () => {
  const res = await api.get('/expenses/list');
  expenses.value = res.data;
};

const fetchAssets = async () => {
  const res = await api.get('/assets/list');
  assets.value = res.data;
};

const handleFileUpload = (e) => {
  form.value.file = e.target.files[0];
};

const openAddModal = () => {
  fetchAssets();
  showAddModal.value = true;
};

const submitExpense = async () => {
  if (form.value.category === 'Maintenance' && !form.value.asset_id) {
    alert("অনুগ্রহ করে একটি Asset সিলেক্ট করুন।");
    return;
  }
  if (form.value.amount <= 0) {
    alert("খরচের পরিমাণ সঠিক নয়।");
    return;
  }

  const formData = new FormData();
  Object.keys(form.value).forEach(key => {
    if (form.value[key] !== null && form.value[key] !== '') {
      formData.append(key, form.value[key]);
    }
  });

  try {
    await api.post('/expenses/add', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    showAddModal.value = false;
    fetchExpenses();
    resetForm();
    alert("Expense recorded successfully!");
  } catch (err) {
    alert("Failed to save expense.");
  }
};

const resetForm = () => {
  form.value = {
    category: 'Maintenance',
    amount: 0,
    description: '',
    asset_id: null,
    payment_method: 'Cash',
    expense_date: new Date().toISOString().substr(0, 10),
    file: null
  };
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-GB');
};

const downloadDoc = async (exp) => {
  try {
    const response = await api.get(`/expenses/download-document/${exp.id}`, { responseType: 'blob' });
    const contentType = response.headers['content-type'];
    let extension = 'pdf';
    if (contentType.includes('image/png')) extension = 'png';
    else if (contentType.includes('image/jpeg')) extension = 'jpg';

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${exp.category}_receipt.${extension}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    alert("ডাউনলোড ব্যর্থ হয়েছে!");
  }
};

onMounted(fetchExpenses);
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>