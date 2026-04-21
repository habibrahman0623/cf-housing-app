<template>
  <div class="space-y-6 p-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-black text-slate-800">Assets Management</h2>
        <p class="text-sm text-gray-500 font-medium">প্রতিষ্ঠানের সকল সম্পদের তালিকা এবং উক্ত সম্পদের আয় ব্যবস্থাপনা</p>
      </div>
      <button @click="showAddModal = true" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 flex items-center gap-2">
        <span>+</span> Add New Asset 
      </button>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="overflow-x-auto tracking-tight">
            <table class="w-full text-left border-collapse min-w-[800px]">
                <thead class="bg-slate-50 text-[10px] uppercase text-slate-500 font-bold tracking-widest">
                <tr>
                    <th class="px-6 py-4">Asset Name</th>
                    <th class="px-6 py-4">Category</th>
                    <th class="px-6 py-4">Purchase Info</th>
                    <th class="px-6 py-4">Book Value</th>
                    <th class="px-6 py-4 text-center">Actions</th>
                </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-sm">
                <tr v-for="asset in assets" :key="asset.id" class="hover:bg-slate-50/50 transition-colors">
                    <td class="px-6 py-4">
                    <div class="font-bold text-slate-700">{{ asset.name }}</div>
                    <div class="text-[10px] text-gray-400">ID: #{{ asset.id }}</div>
                    </td>
                    <td class="px-6 py-4">
                    <span class="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase">{{ asset.category }}</span>
                    </td>
                    <td class="px-6 py-4">
                    <div class="font-bold">৳ {{ asset.purchase_amount }}</div>
                    <div class="text-[10px] text-gray-500">{{ asset.purchase_date }}</div>
                    </td>
                    <td class="px-6 py-4 font-black text-emerald-600">৳ {{ asset.current_book_value }}</td>
                    <td class="px-6 py-4">
                    <div class="flex justify-center gap-2">
                        <button @click="openIncomeModal(asset)" class="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all" title="Record Income">
                        Add Income💰
                        </button>
                        <button 
                        v-if="asset.has_document" 
                        @click="downloadDoc(asset.id, asset.name)" 
                        class="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-800 hover:text-white transition-all" title="Download Document"
                        >
                        Download Document📄
                        </button>
                    </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>    
    </div>
    <Teleport to="body">
  <div v-if="showAddModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showAddModal = false"></div>
    
    <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl z-10 overflow-hidden border border-indigo-100">
      <div class="bg-indigo-600 p-6 text-white flex justify-between items-center">
        <div>
          <h3 class="text-xl font-black uppercase tracking-tight">Add New Asset</h3>
          <p class="text-xs opacity-80">নতুন সম্পদ বা সম্পত্তি যুক্ত করুন</p>
        </div>
        <button @click="showAddModal = false" class="text-2xl hover:rotate-90 transition-all">✕</button>
      </div>

      <div class="p-8 grid grid-cols-2 gap-4">
        <div class="col-span-2">
          <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Asset Name</label>
          <input v-model="newAsset.name" type="text" placeholder="উদা: অফিস ফার্নিচার বা ল্যান্ড" class="w-full px-4 py-3 border-2 border-slate-100 rounded-xl outline-none focus:border-indigo-500 font-bold">
        </div>

        <div>
          <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Category</label>
          <select v-model="newAsset.category" class="w-full px-4 py-3 border-2 border-slate-100 rounded-xl outline-none focus:border-indigo-500 font-bold">
            <option value="Land">Land (জমি)</option>
            <option value="Building">Building (ভবন)</option>
            <option value="Furniture">Furniture (আসবাবপত্র)</option>
            <option value="Electronics">Electronics</option>
            <option value="Vehicle">Vehicle</option>
          </select>
        </div>

        <div>
          <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Purchase Amount (৳)</label>
          <input v-model="newAsset.amount" type="number" class="w-full px-4 py-3 border-2 border-slate-100 rounded-xl outline-none focus:border-indigo-500 font-bold">
        </div>

        <div>
          <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Purchase Date</label>
          <input v-model="newAsset.purchase_date" type="date" class="w-full px-4 py-3 border-2 border-slate-100 rounded-xl outline-none focus:border-indigo-500 font-bold">
        </div>

        <div>
          <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Legal Document (PDF/Img)</label>
          <input @change="handleFileUpload" type="file" class="text-xs mt-2">
        </div>

        <div class="col-span-2 flex gap-3 mt-4">
          <button @click="showAddModal = false" class="flex-1 py-3 text-sm font-bold text-gray-400 hover:bg-slate-50 rounded-xl transition-all uppercase">Cancel</button>
          <button @click="submitAsset" class="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all uppercase">Save Asset</button>
        </div>
      </div>
    </div>
  </div>
</Teleport>

        <Teleport to="body">
            <div v-if="showIncomeModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showIncomeModal = false"></div>
                
                <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-md z-10 overflow-hidden border border-emerald-100 flex flex-col max-h-[90vh]">
                
                <div class="bg-emerald-600 p-5 text-white text-center shrink-0">
                    <div class="text-2xl mb-1">💰</div>
                    <h3 class="text-lg font-black uppercase">Record Income</h3>
                    <p class="text-[10px] opacity-90">{{ selectedAsset?.name }}</p>
                </div>

                <div class="p-6 space-y-4 overflow-y-auto custom-scrollbar">
                    <div>
                    <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Income Type</label>
                    <select v-model="incomeForm.income_type" class="w-full px-4 py-3 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500 font-bold">
                        <option value="Rent">Rent (ভাড়া)</option>
                        <option value="Sale">Sale (বিক্রয়)</option>
                        <option value="Scrap">Scrap (অবশেষ)</option>
                    </select>
                    </div>

                    <div>
                    <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Amount Received (৳)</label>
                    <input v-model="incomeForm.amount" type="number" class="w-full px-4 py-3 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500 font-bold">
                    </div>

                    <div>
                    <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Income Date</label>
                    <input v-model="incomeForm.income_date" type="date" class="w-full px-4 py-3 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500 font-bold text-slate-700">
                    </div>

                    <div>
                    <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Description</label>
                    <textarea v-model="incomeForm.description" rows="2" placeholder="আয়ের বিবরণ..." class="w-full px-4 py-3 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500 text-sm"></textarea>
                    </div>

                    <div>
                    <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Attachment / Receipt</label>
                    <div class="relative border-2 border-dashed border-slate-200 rounded-xl p-4 bg-slate-50">
                        <input @change="handleIncomeFileUpload" type="file" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                        <div class="text-center text-[10px] text-slate-500 font-medium">
                        {{ incomeForm.file ? incomeForm.file.name : 'Click to upload receipt' }}
                        </div>
                    </div>
                    </div>
                </div>

                <div class="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 shrink-0">
                    <button @click="showIncomeModal = false" class="flex-1 py-3 text-sm font-bold text-gray-400 hover:bg-white rounded-xl transition-all uppercase">Cancel</button>
                    <button @click="submitIncome" class="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all uppercase">Submit</button>
                </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';

const assets = ref([]);
const showAddModal = ref(false);
const showIncomeModal = ref(false);

// ১. লিস্ট নিয়ে আসা
const fetchAssets = async () => {
  try {
    const response = await api.get('/assets/list');
    assets.value = response.data;
  } catch (err) {
    console.error("Error fetching assets");
  }
};

// ২. ডকুমেন্ট ডাউনলোড লজিক
const downloadDoc = async (assetId, assetName) => {
  try {
    const response = await api.get(`/assets/download-document/${assetId}`, {
      responseType: 'blob' 
    });
    
    // ১. এপিআই রেসপন্স থেকে কন্টেন্ট টাইপ বের করা (উদা: image/png বা application/pdf)
    const contentType = response.headers['content-type'];
    
    // ২. কন্টেন্ট টাইপ অনুযায়ী এক্সটেনশন নির্ধারণ করা
    let extension = 'pdf'; // ডিফল্ট
    if (contentType.includes('image/png')) extension = 'png';
    else if (contentType.includes('image/jpeg')) extension = 'jpg';
    else if (contentType.includes('image/jpg')) extension = 'jpg';

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // ৩. ডাইনামিক ফাইল নেম সেট করা
    link.setAttribute('download', `${assetName}_doc.${extension}`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url); // মেমোরি ক্লিনআপ
  } catch (err) {
    console.error("Download error:", err);
    alert("ডকুমেন্ট ডাউনলোড করা সম্ভব হয়নি!");
  }
};

// ৩. নতুন অ্যাসেট অ্যাড করা (FormData ব্যবহার করে)
const newAsset = ref({
  name: '', category: '', amount: 0, purchase_date: '', file: null
});

const handleFileUpload = (event) => {
  newAsset.value.file = event.target.files[0];
};

const submitAsset = async () => {
  const formData = new FormData();
  formData.append('name', newAsset.value.name);
  formData.append('category', newAsset.value.category);
  formData.append('amount', newAsset.value.amount);
  formData.append('purchase_date', newAsset.value.purchase_date);
  if (newAsset.value.file) {
    formData.append('file', newAsset.value.file);
  }

  try {
    await api.post('/assets/add', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    alert("Asset added successfully!");
    showAddModal.value = false;
    fetchAssets();
  } catch (err) {
    alert("Error adding asset");
  }
};

const selectedAsset = ref(null);
const incomeForm = ref({
  amount: 0,
  income_type: 'Rent',
  description: '',
  income_date: new Date().toISOString().substr(0, 10), // ডিফল্ট আজকের তারিখ
  file: null
});

const openIncomeModal = (asset) => {
  selectedAsset.value = asset;
  showIncomeModal.value = true;
};

const handleIncomeFileUpload = (e) => {
  incomeForm.value.file = e.target.files[0];
};

const submitIncome = async () => {
  const formData = new FormData();
  formData.append('asset_id', selectedAsset.value.id);
  formData.append('amount', incomeForm.value.amount);
  formData.append('income_type', incomeForm.value.income_type);
  formData.append('description', incomeForm.value.description);
  if (incomeForm.value.income_date) {
    formData.append('income_date', incomeForm.value.income_date);
  }
  if (incomeForm.value.file) {
    formData.append('file', incomeForm.value.file);
  }

  try {
    await api.post('/assets/record-income', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    alert("Income recorded successfully!");
    showIncomeModal.value = false;
    fetchAssets(); // টেবিল রিফ্রেশ (যদি সেল হয়ে যায় তবে লিস্ট থেকে সরে যাবে)
  } catch (err) {
    alert("আয় রেকর্ড করতে সমস্যা হয়েছে।");
  }
};

onMounted(fetchAssets);
</script>