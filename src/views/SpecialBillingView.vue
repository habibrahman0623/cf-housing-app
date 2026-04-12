<template>
  <div class="w-full space-y-6">
    <!-- Top Action Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      <div @click="showSpecialModal = true" class="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-emerald-500 cursor-pointer hover:shadow-md transition-all">
        <div class="text-3xl mb-2">📅</div>
        <h4 class="font-bold text-slate-800">Generate Special Bill</h4>
        <p class="text-xs text-gray-500 font-medium">সবার জন্য স্পেশাল বিল তৈরি করুন</p>
      </div>

      <div @click="showFineModal = true" class="bg-white p-5 rounded-2xl shadow-sm border-b-4 border-orange-500 cursor-pointer hover:shadow-md transition-all">
        <div class="text-3xl mb-2">⚠️</div>
        <h4 class="font-bold text-slate-800">Apply Fine</h4>
        <p class="text-xs text-gray-500 font-medium">Add fine to pending bills</p>
      </div>

      <div @click="showWaiveModal = true" class="bg-white p-5 rounded-2xl shadow-sm border-b-4 border-blue-500 cursor-pointer hover:shadow-md transition-all">
        <div class="text-3xl mb-2">🕊️</div>
        <h4 class="font-bold text-slate-800">Waive Fine</h4>
        <p class="text-xs text-gray-500 font-medium">Remove fine from a member</p>
      </div>

      <div @click="showCancelModal = true" class="bg-white p-5 rounded-2xl shadow-sm border-b-4 border-red-500 cursor-pointer hover:shadow-md transition-all">
        <div class="text-3xl mb-2">❌</div>
        <h4 class="font-bold text-slate-800">Cancel Bill</h4>
        <p class="text-xs text-gray-500 font-medium">Delete specific month's bill</p>
      </div>
    </div>

    <!-- Billing History Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden w-full">
      <div class="p-5 border-b bg-gray-50/50 flex justify-between items-center">
        <h3 class="font-black text-slate-700 uppercase tracking-wider text-sm">Recent Special Bills</h3>
        <button class="text-xs bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg font-bold hover:bg-emerald-100 transition-colors">
          View All History ➔
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50 text-[10px] uppercase text-slate-500 font-bold tracking-widest">
            <tr>
              <th class="px-6 py-4 border-b">Billing Name</th>
              <th class="px-6 py-4 border-b">Rate/Share</th>
              <th class="px-6 py-4 border-b">Total Generated</th>
              <th class="px-6 py-4 border-b text-center">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm font-medium">
            <tr v-for="i in 5" :key="i" class="hover:bg-slate-50/50 transition-colors">
              <td class="px-6 py-4 text-slate-700 font-bold">Special Bill April 2026</td>
              <td class="px-6 py-4 text-slate-600">৳ 3000.00</td>
              <td class="px-6 py-4 text-slate-600">৳ 1,80,000 (60 shares)</td>
              <td class="px-6 py-4 text-center">
                <span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-emerald-200">
                  SUCCESS
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Generate Monthly Bill Modal -->
    <Teleport to="body">
      <div v-if="showSpecialModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showSpecialModal = false"></div>
        
        <div @click.stop class="relative bg-white rounded-3xl shadow-2xl w-full max-w-md z-10 border border-emerald-100 flex flex-col max-h-[95vh]">
          
          <div class="p-6 pb-2 text-center flex-shrink-0">
            <div class="bg-emerald-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
              <span class="text-2xl">🗓️</span>
            </div>
            <h3 class="text-xl font-black text-slate-800">Generate Bills</h3>
            <p class="text-xs text-gray-500">স্পেশাল বিল তৈরি করুন</p>
          </div>
          
          <form @submit.prevent="submitSpecialBills" class="p-6 pt-2 space-y-4 overflow-y-auto">
            <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1">Enter Special Bill Name</label>
              <input v-model="specialBillData.bill_name" type="text" required class="w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-emerald-500 transition-all font-semibold text-sm">
            </div>
            <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1">Enter Description</label>
              <input v-model="specialBillData.description" type="text" required class="w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-emerald-500 transition-all font-semibold text-sm">
            </div>
            <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1">Amonut</label>
              <div class="relative">
                <span class="absolute left-4 top-3 text-gray-400 font-bold">৳</span>
                <input v-model.number="specialBillData.amount" type="number" required class="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-emerald-500 transition-all text-slate-700 font-bold text-sm">
              </div>
            </div>
            <div class="flex items-center justify-between">
                <div>
                <h4 class="text-sm font-bold text-slate-700">Per Share Billing?</h4>
                <p class="text-[10px] text-gray-500">অন করলে শেয়ার অনুযায়ী বিল ক্যালকুলেট হবে</p>
                </div>
                
                <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="specialBillData.is_per_share" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1">Payment Due Date</label>
              <input v-model="specialBillData.due_date" type="date" required class="w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-emerald-500 transition-all font-semibold text-sm">
            </div>
            
            <div class="flex gap-3 pt-4 sticky bottom-0 bg-white">
              <button type="button" @click="showSpecialModal = false" class="flex-1 py-3 text-sm text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-all border border-gray-100">
                বাতিল
              </button>
              <button type="submit" :disabled="isGenerating" class="flex-1 py-3 text-sm bg-emerald-600 text-white rounded-xl font-black shadow-lg shadow-emerald-200 hover:bg-emerald-700 disabled:bg-gray-300 transition-all">
                {{ isGenerating ? 'প্রসেসিং...' : 'জেনারেট করুন' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!--Apply Bulk Fine-->
    <Teleport to="body">
      <div v-if="showFineModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showFineModal = false"></div>
        
        <div @click.stop class="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm z-10 border border-orange-100 p-6">
          <div class="text-center mb-6">
            <div class="bg-orange-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">⚠️</div>
            <h3 class="text-xl font-bold text-slate-800">Apply Bulk Fine</h3>
            <p class="text-xs text-gray-500">বকেয়া বিলের ওপর জরিমানা ধার্য করুন</p>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Bill Name</label>
              <input v-model="fineData.bill_name" type="text" required class="w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-emerald-500 transition-all font-semibold text-sm">
            </div>

            <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Fine Amount (৳)</label>
              <input v-model.number="fineData.fine_amount" type="number" class="w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-orange-500 font-bold text-slate-700">
            </div>

            <div class="flex gap-2 pt-2">
              <button @click="showFineModal = false" class="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-all">বাতিল</button>
              <button @click="applyBulkFine" :disabled="isApplyingFine" class="flex-1 py-3 text-sm bg-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 disabled:bg-gray-300">
                {{ isApplyingFine ? 'প্রসেসিং...' : 'প্রয়োগ করুন' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!--Waive fine modal-->
    <Teleport to="body">
      <div v-if="showWaiveModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showWaiveModal = false"></div>
        
        <div @click.stop class="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm z-10 border border-blue-100 p-6">
          <div class="text-center mb-6">
            <div class="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">🕊️</div>
            <h3 class="text-xl font-bold text-slate-800">Waive Fine</h3>
            <p class="text-xs text-gray-500">মেম্বারের জরিমানা মওকুফ করুন</p>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Member Code</label>
              <input v-model="waiveData.member_code" type="text" placeholder="উদা: CF-001" class="w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-blue-500 font-bold text-slate-700 uppercase">
            </div>

            <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Bill Name</label>
              <input v-model="waiveData.bill_name" type="text" class="w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-blue-500 font-bold text-slate-700">
            </div>

            <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Reason for Waive</label>
              <textarea v-model="waiveData.reason" rows="2" placeholder="কেন মওকুফ করা হচ্ছে?" class="w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-blue-500 text-sm font-medium"></textarea>
            </div>

            <div class="flex gap-2 pt-2">
              <button @click="showWaiveModal = false" class="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-all">বাতিল</button>
              <button @click="waiveFine" :disabled="isWaivingFine" class="flex-1 py-3 text-sm bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-gray-300">
                {{ isWaivingFine ? 'প্রসেসিং...' : 'নিশ্চিত করুন' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showCancelModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showCancelModal = false"></div>
        
        <div @click.stop class="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm z-10 border border-red-100 p-6">
          <div class="text-center mb-6">
            <div class="bg-red-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">❌</div>
            <h3 class="text-xl font-bold text-slate-800">Cancel Bill</h3>
            <p class="text-xs text-gray-500">মেম্বারের মাসিক বিল বাতিল করুন</p>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Member Code</label>
              <input v-model="cancelData.member_code" type="text" placeholder="CF-001" class="w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-red-500 font-bold text-slate-700 uppercase">
            </div>

            <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Bill Name</label>
              <input v-model="cancelData.bill_name" type="text" class="w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-red-500 font-bold text-slate-700">
            </div>

            <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Reason for Cancellation</label>
              <textarea v-model="cancelData.reason" rows="2" placeholder="বাতিল করার কারণ লিখুন..." class="w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-red-500 text-sm font-medium"></textarea>
            </div>

            <div class="flex gap-2 pt-2">
              <button @click="showCancelModal = false" class="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-all">বাতিল</button>
              <button @click="cancelBill" :disabled="isCancelingBill" class="flex-1 py-3 text-sm bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 disabled:bg-gray-300">
                {{ isCancelingBill ? 'প্রসেসিং...' : 'বিল বাতিল করুন' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import api from '../api';

const showSpecialModal = ref(false);
const isGenerating = ref(false);
const specialBillData = ref({
  //selected_date: new Date().toISOString().split('T')[0],
  bill_name: '',
  description:'',
  amount: 3000,
  is_per_share: true,
  due_date: ''
});

const isApplyingFine = ref(false);
const showFineModal = ref(false); // জরিমানার মডাল দেখানোর জন্য
const fineData = ref({
  bill_name: '', // এটি আমরা watch দিয়ে অটো সেট করব
  fine_amount: 100    // ডিফল্ট ১০০ টাকা
});

const showWaiveModal = ref(false);
const isWaivingFine = ref(false);

const waiveData = ref({
  member_code: '',
  bill_name: '', // এটিও আমরা অটো-সিঙ্ক করব
  reason: ''
});

const showCancelModal = ref(false);
const isCancelingBill = ref(false);

const cancelData = ref({
  member_code: '',
  bill_name: '',
  reason: ''
});

// watch(() => monthlyBillData.value.selected_date, (newDate) => {
//   if (newDate) {
//     const [year, month] = newDate.split('-');
//     monthlyBillData.value.billing_period = `${year}-${month}`;
//     monthlyBillData.value.due_date = `${year}-${month}-15`;
//   }
// }, { immediate: true });

const submitSpecialBills = async () => {
  if (!confirm("আপনি কি নিশ্চিত?")) return;
  isGenerating.value = true;
  try {
    //const token = localStorage.getItem('token');
    const payload = {
      bill_name: specialBillData.value.bill_name,
      description: specialBillData.value.description,
      amount: specialBillData.value.amount,
      is_per_share: specialBillData.value.is_per_share,
      due_date: new Date(specialBillData.value.due_date).toISOString() 
    };
    await api.post('/billing/generate-special-charge', 
      payload
    );
    alert("বিল জেনারেট সফল হয়েছে!");
    showSpecialModal.value = false;
  } catch (err) {
    alert(err.response?.data?.detail || "Error occurred");
  } finally {
    isGenerating.value = false;
  }
};

const applyBulkFine = async () => {
  if (!confirm(`আপনি কি নিশ্চিত যে ${fineData.value.bill_name} মাসের জন্য ৳${fineData.value.fine_amount} জরিমানা যোগ করবেন?`)) return;

  isApplyingFine.value = true;
//   const [year, month] = fineData.value.billing_period.split('-');
//   fineData.value.billing_period = `${year}-${month}`;

  try {
    const response = await api.post('/billing/apply-bulk-fine-special', {
      bill_name: fineData.value.bill_name,
      fine_amount: fineData.value.fine_amount
    });

    alert(` ${response.data.message} `);
    showFineModal.value = false; // কাজ শেষ হলে মডাল বন্ধ
  } catch (err) {
    alert(err.response?.data?.detail || "জরিমানা প্রয়োগ করা সম্ভব হয়নি।");
  } finally {
    isApplyingFine.value = false;
  }
};

const waiveFine = async () => {
  if (!waiveData.value.member_code || !waiveData.value.reason || !waiveData.value.billing_period) {
    alert("দয়া করে মেম্বার কোড এবং কারণ উল্লেখ করুন।");
    return;
  }

  isWaivingFine.value = true;
//   const [year, month] = waiveData.value.billing_period.split('-');
//   waiveData.value.billing_period = `${year}-${month}`;
  try {
    const response = await api.post('/billing/waive-fine-special', {
      member_code: waiveData.value.member_code,
      bill_name: waiveData.value.bill_name,
      reason: waiveData.value.reason
    });

    alert(` (${response.data.message}) `);
    showWaiveModal.value = false;
    
    // ফর্ম রিসেট
    waiveData.value.member_code = '';
    waiveData.value.reason = '';
    waiveData.value.bill_name = '';
    
  } catch (err) {
    alert(err.response?.data?.detail || "জরিমানা মওকুফ করা সম্ভব হয়নি।");
  } finally {
    isWaivingFine.value = false;
  }
};

const cancelBill = async () => {
  if (!cancelData.value.member_code || !cancelData.value.reason || !cancelData.value.bill_name) {
    alert("মেম্বার কোড এবং কারণ অবশ্যই লিখতে হবে।");
    return;
  }

  if (!confirm("আপনি কি নিশ্চিত যে এই মেম্বারের মাসিক বিলটি বাতিল করতে চান? এটি আর ফিরে পাওয়া যাবে না।")) return;

  isCancelingBill.value = true;
//   const [year, month] = cancelData.value.billing_period.split('-');
//   cancelData.value.billing_period = `${year}-${month}`;
  try {
    // Axios DELETE রিকোয়েস্টের নিয়ম অনুযায়ী বডি পাঠাতে 'data' প্রপার্টি লাগে
    const response = await api.delete('/billing/cancel-special-bill', {
      data: {
        member_code: cancelData.value.member_code,
        bill_name: cancelData.value.bill_name,
        reason: cancelData.value.reason
      }
    });

    alert(`${response.data.message}`);
    showCancelModal.value = false;
    
    // ফর্ম রিসেট
    cancelData.value.member_code = '';
    cancelData.value.reason = '';
    cancelData.value.bill_name = '';
    
  } catch (err) {
    alert(err.response?.data?.detail || "বিল বাতিল করা সম্ভব হয়নি।");
  } finally {
    isCancelingBill.value = false;
  }
};

</script>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
    display: block;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2310b981' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E") no-repeat;
    width: 20px;
    height: 20px;
    cursor: pointer;
    opacity: 1;
}

input[type="date"] {
    position: relative;
    appearance: none;
    -webkit-appearance: none;
}

/* Custom Scrollbar for form if needed */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #10b981;
  border-radius: 10px;
}
</style>