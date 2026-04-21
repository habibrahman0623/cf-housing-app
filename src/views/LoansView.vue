<template>
  <div class="p-6 h-screen flex flex-col space-y-6 overflow-hidden bg-slate-50/50">
    
    <div class="shrink-0 space-y-4">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-black text-slate-800 uppercase tracking-tight">Liability & Loans</h2>
          <p class="text-xs text-gray-500 font-bold font-bangla">প্রতিষ্ঠানের ঋণ এবং কিস্তি ব্যবস্থাপনা</p>
        </div>
        <button @click="openAddLoanModal" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 flex items-center gap-2 text-sm">
          <span class="text-xl">+</span> Add New Loan
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overall Debt</p>
        <h3 class="text-2xl font-black text-slate-800">৳ {{ stats.total_debt }}</h3>
        <div class="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div class="bg-indigo-500 h-full" :style="{width: (stats.total_paid/stats.total_debt)*100 + '%'}"></div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 border-l-4 border-l-red-500">
        <p class="text-[10px] font-black text-red-400 uppercase tracking-widest">This Month Due</p>
        <h3 class="text-2xl font-black text-red-600">৳ {{ stats.this_month_due }}</h3>
        <p class="text-[10px] text-slate-400 mt-1 italic font-bold">Payable by end of month</p>
      </div>

      <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Remaining to Pay</p>
        <h3 class="text-2xl font-black text-slate-800">৳ {{ stats.total_remaining }}</h3>
      </div>

      <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 border-l-4 border-l-green-500">
        <p class="text-[10px] font-black text-green-400 uppercase tracking-widest">Total Paid</p>
        <h3 class="text-2xl font-black text-green-600">৳ {{ stats.total_paid }}</h3>
      </div>
    </div>
    </div>

    <div class="flex gap-4 border-b border-slate-200 shrink-0">
      <button @click="activeTab = 'pending'" :class="activeTab === 'pending' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'" class="pb-3 px-2 text-sm font-bold border-b-2 transition-all">
        Upcoming Installments ({{ pendingInstallments.length }})
      </button>
      <button @click="activeTab = 'all'" :class="activeTab === 'all' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'" class="pb-3 px-2 text-sm font-bold border-b-2 transition-all">
        All Active Loans ({{ activeLoans.length }})
      </button>
      <button @click="activeTab = 'closed'" :class="activeTab === 'closed' ? 'border-slate-600 text-slate-600' : 'border-transparent text-slate-400'" class="pb-3 px-2 text-sm font-bold border-b-2 transition-all">
          Closed Loans ({{ closedLoans.length }})
      </button>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col flex-grow overflow-hidden">
      <div class="overflow-y-auto overflow-x-auto h-full custom-scrollbar relative">
        
        <table v-if="activeTab === 'pending'" class="w-full text-left border-separate border-spacing-0 min-w-[900px]">
          <thead>
            <tr class="bg-slate-50">
              <th class="sticky top-0 z-30 bg-slate-50 border-b px-6 py-4 text-[10px] font-black uppercase text-slate-500">Lender</th>
              <th class="sticky top-0 z-30 bg-slate-50 border-b px-6 py-4 text-[10px] font-black uppercase text-slate-500">Due Date</th>
              <th class="sticky top-0 z-30 bg-slate-50 border-b px-6 py-4 text-[10px] font-black uppercase text-slate-500">Inst. Amount</th>
              <th class="sticky top-0 z-30 bg-slate-50 border-b px-6 py-4 text-[10px] font-black uppercase text-slate-500">Remaining</th>
              <th class="sticky top-0 z-30 bg-slate-50 border-b px-6 py-4 text-[10px] font-black uppercase text-slate-500">Status</th>
              <th class="sticky top-0 z-30 bg-slate-50 border-b px-6 py-4 text-[10px] font-black uppercase text-slate-500 text-center">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm">
            <tr v-for="item in pendingInstallments" :key="item.schedule_id" class="hover:bg-slate-50/50">
              <td class="px-6 py-4 font-bold text-slate-700">{{ item.lender_name }}</td>
              <td class="px-6 py-4 text-red-500 font-bold">{{ formatDate(item.due_date) }}</td>
              <td class="px-6 py-4 font-black">৳ {{ item.installment_amount }}</td>
              <td class="px-6 py-4">৳ {{ item.remaining_to_pay }}</td>
              <td class="px-6 py-4">
                <span :class="item.status === 'Partial' ? 'bg-amber-100 text-amber-600' : 'bg-red-50 text-red-500'" class="px-2 py-0.5 rounded text-[10px] font-black uppercase">
                  {{ item.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <button @click="openPayModal(item)" class="bg-slate-900 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-600 transition-colors">
                  Repay Now
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <table v-else-if="activeTab === 'all'" class="w-full text-left border-separate border-spacing-0 min-w-[900px]">
          <thead>
            <tr class="bg-slate-50">
              <th class="sticky top-0 z-30 bg-slate-50 border-b px-6 py-4 text-[10px] font-black uppercase text-slate-500">Lender</th>
              <th class="sticky top-0 z-30 bg-slate-50 border-b px-6 py-4 text-[10px] font-black uppercase text-slate-500">Principle Amount</th>
              <th class="sticky top-0 z-30 bg-slate-50 border-b px-6 py-4 text-[10px] font-black uppercase text-slate-500">Profit Amount</th>
              <th class="sticky top-0 z-30 bg-slate-50 border-b px-6 py-4 text-[10px] font-black uppercase text-slate-500">Toatl Payable</th>
              <th class="sticky top-0 z-30 bg-slate-50 border-b px-6 py-4 text-[10px] font-black uppercase text-slate-500">Paid Amount</th>
              <th class="sticky top-0 z-30 bg-slate-50 border-b px-6 py-4 text-[10px] font-black uppercase text-slate-500">Remaining Amount</th>
              <th class="sticky top-0 z-30 bg-slate-50 border-b px-6 py-4 text-[10px] font-black uppercase text-slate-500 text-center">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm">
            <tr v-for="item in activeLoans" :key="item.id" class="hover:bg-slate-50/50">
              <td class="px-6 py-4 font-bold text-slate-700">{{ item.lender_name }}</td>
              <td class="px-6 py-4 text-red-500 font-bold">{{ item.principal_amount }}</td>
              <td class="px-6 py-4 font-black">৳ {{ item.total_interest_amount }}</td>
              <td class="px-6 py-4">৳ {{ item.total_payable }}</td>
              <td class="px-6 py-4">৳ {{ item.total_payable - item.remaining_balance}}</td>
              <td class="px-6 py-4">৳ {{ item.remaining_balance }}</td>
              <td class="px-6 py-4 text-center">
                <button @click="openSchedule(item)" class="bg-slate-900 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-600 transition-colors">
                  See Schedule
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <table v-else-if="activeTab === 'closed'" class="w-full text-left border-separate border-spacing-0 min-w-[900px]">
          <thead>
            <tr class="bg-slate-50">
              <th class="sticky top-0 z-30 bg-slate-50 border-b px-6 py-4 text-[10px] font-black uppercase text-slate-500">Lender</th>
              <th class="sticky top-0 z-30 bg-slate-50 border-b px-6 py-4 text-[10px] font-black uppercase text-slate-500">Principle Amount</th>
              <th class="sticky top-0 z-30 bg-slate-50 border-b px-6 py-4 text-[10px] font-black uppercase text-slate-500">Profit Amount</th>
              <th class="sticky top-0 z-30 bg-slate-50 border-b px-6 py-4 text-[10px] font-black uppercase text-slate-500">Toatl Payable</th>
              <th class="sticky top-0 z-30 bg-slate-50 border-b px-6 py-4 text-[10px] font-black uppercase text-slate-500">Paid Amount</th>
              <th class="sticky top-0 z-30 bg-slate-50 border-b px-6 py-4 text-[10px] font-black uppercase text-slate-500">Remaining Amount</th>
              <th class="sticky top-0 z-30 bg-slate-50 border-b px-6 py-4 text-[10px] font-black uppercase text-slate-500 text-center">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm">
            <tr v-for="item in closedLoans" :key="item.id" class="hover:bg-slate-50/50">
              <td class="px-6 py-4 font-bold text-slate-700">{{ item.lender_name }}</td>
              <td class="px-6 py-4 text-red-500 font-bold">{{ item.principal_amount }}</td>
              <td class="px-6 py-4 font-black">৳ {{ item.total_interest_amount }}</td>
              <td class="px-6 py-4">৳ {{ item.total_payable }}</td>
              <td class="px-6 py-4">৳ {{ item.total_payable - item.remaining_balance}}</td>
              <td class="px-6 py-4">৳ {{ item.remaining_balance }}</td>
              <td class="px-6 py-4 text-center">
                <button @click="openSchedule(item)" class="bg-slate-900 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-600 transition-colors">
                  See Schedule
                </button>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>

    <Teleport to="body">
  <div v-if="showDrawer" class="fixed inset-0 z-[1000] overflow-hidden">
    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="showDrawer = false"></div>
    
    <div class="absolute inset-y-0 right-0 max-w-xl w-full bg-white shadow-2xl flex flex-col translate-x-0 transition-transform duration-300">
      
      <div class="p-6 bg-slate-900 text-white shrink-0 flex justify-between items-start">
        <div>
          <h3 class="text-xl font-black uppercase tracking-tight">{{ selectedLoan.lender_name }}</h3>
          <p class="text-[10px] text-slate-400 font-bold">LOAN ID: #{{ selectedLoan.id }} | ISSUED: {{ formatDate(selectedLoan.issued_date) }}</p>
        </div>
        <button @click="showDrawer = false" class="p-2 hover:bg-white/10 rounded-full transition-colors">
          <span class="text-2xl font-light">✕</span>
        </button>
      </div>

      <div class="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 bg-slate-50 p-4 shrink-0">
        <div class="text-center">
          <p class="text-[9px] font-black text-slate-400 uppercase">Principal</p>
          <p class="font-bold text-slate-700 italic">৳ {{ selectedLoan.principal_amount }}</p>
        </div>
        <div class="text-center">
          <p class="text-[9px] font-black text-slate-400 uppercase">Paid</p>
          <p class="font-bold text-green-600">৳ {{ selectedLoan.total_payable - selectedLoan.remaining_balance }}</p>
        </div>
        <div class="text-center">
          <p class="text-[9px] font-black text-slate-400 uppercase">Balance</p>
          <p class="font-bold text-red-500 font-black">৳ {{ selectedLoan.remaining_balance }}</p>
        </div>
      </div>

      <div class="flex-grow overflow-y-auto p-6 custom-scrollbar">
        <div class="space-y-4">
          <h4 class="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Repayment Schedule</h4>
          
          <div v-for="(sc, index) in selectedLoan.schedules" :key="sc.id" 
               class="p-4 rounded-2xl border border-slate-100 flex items-center justify-between"
               :class="sc.status === 'Paid' ? 'bg-slate-50/50 grayscale' : 'bg-white shadow-sm'">
            
            <div class="flex items-center gap-4">
              <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                {{ index + 1 }}
              </div>
              <div>
                <p class="text-xs font-black text-slate-700">{{ formatDate(sc.due_date) }}</p>
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Inst: ৳{{ sc.total_installment }}</p>
              </div>
            </div>

            <div class="text-right flex flex-col items-end gap-1">
              <span :class="{
                'bg-green-100 text-green-600': sc.status === 'Paid',
                'bg-amber-100 text-amber-600 font-black': sc.status === 'Partial',
                'bg-red-50 text-red-500': sc.status === 'Pending'
              }" class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                {{ sc.status }}
              </span>
              <p v-if="sc.paid_amount > 0" class="text-[9px] font-bold text-slate-400">Paid: ৳{{ sc.paid_amount }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="p-6 bg-slate-50 border-t shrink-0">
        <button @click="showDrawer = false" class="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-600 transition-all">
          Close Detail View
        </button>
      </div>
    </div>
  </div>
</Teleport>

    <Teleport to="body">
      <div v-if="showPayModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showPayModal = false"></div>
        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-md z-10 overflow-hidden flex flex-col">
          <div class="bg-slate-900 p-5 text-white flex justify-between items-center">
             <h3 class="text-lg font-black uppercase italic">Repay Installment</h3>
             <button @click="showPayModal = false">✕</button>
          </div>
          <div class="p-8 space-y-4">
            <div class="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
               <p class="text-[10px] font-black text-indigo-400 uppercase">Lender: {{ selectedInst.lender_name }}</p>
               <p class="text-sm font-bold text-indigo-900">Due Amount: ৳ {{ selectedInst.remaining_to_pay }}</p>
            </div>
            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Payment Amount (৳)</label>
              <input v-model="payForm.amount" type="number" class="w-full px-4 py-3 border-2 border-slate-100 rounded-xl outline-none focus:border-indigo-500 font-bold">
              <p v-if="payForm.amount>selectedInst.remaining_to_pay" class="text-[9px] text-red-500 font-bold italic">*Payment amount should be less than or equal Due amount</p>
            </div>
            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Payment Date</label>
              <input v-model="payForm.date" type="date" class="w-full px-4 py-3 border-2 border-slate-100 rounded-xl outline-none focus:border-indigo-500 font-bold">
            </div>
            <button @click="submitRepayment" class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase shadow-lg shadow-indigo-100">
              Confirm Payment
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
  <div v-if="showAddLoanModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showAddLoanModal = false"></div>
    
    <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl z-10 overflow-hidden flex flex-col max-h-[95vh]">
      <div class="bg-indigo-600 p-5 text-white flex justify-between items-center shrink-0">
        <div>
          <h3 class="text-lg font-black uppercase italic tracking-widest">Create External Loan Record</h3>
          <p class="text-[10px] opacity-80">নতুন ঋণের তথ্য এবং কিস্তির শিডিউল তৈরি করুন</p>
        </div>
        <button @click="showAddLoanModal = false" class="text-xl hover:rotate-90 transition-all">✕</button>
      </div>

      <div class="flex flex-col md:flex-row overflow-hidden">
        <div class="w-full md:w-1/3 p-6 border-r border-slate-100 overflow-y-auto custom-scrollbar space-y-4 bg-slate-50/30">
          <h4 class="text-[11px] font-black text-indigo-600 uppercase mb-4">Loan Details</h4>
          
          <div>
            <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Lender Name</label>
            <input v-model="loanForm.lender_name" type="text" class="w-full px-4 py-2.5 border-2 border-white rounded-xl outline-none focus:border-indigo-500 font-bold text-sm shadow-sm" placeholder="e.g. Sonali Bank">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Principal (৳)</label>
              <input v-model.number="loanForm.principal" @input="generateSchedule" type="number" class="w-full px-4 py-2.5 border-2 border-white rounded-xl outline-none focus:border-indigo-500 font-bold text-sm shadow-sm">
            </div>
            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Total Profit (৳)</label>
              <input v-model.number="loanForm.total_interest" @input="generateSchedule" type="number" class="w-full px-4 py-2.5 border-2 border-white rounded-xl outline-none focus:border-indigo-500 font-bold text-sm shadow-sm">
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Issued Date</label>
            <input v-model="loanForm.issued_date" type="date" class="w-full px-4 py-2.5 border-2 border-white rounded-xl outline-none focus:border-indigo-500 font-bold text-sm shadow-sm">
          </div>

          <div>
            <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">No. of Installments</label>
            <input v-model.number="loanForm.installment_count" @input="generateSchedule" type="number" class="w-full px-4 py-2.5 border-2 border-white rounded-xl outline-none focus:border-indigo-500 font-bold text-sm shadow-sm">
          </div>

          <div>
            <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Support Document</label>
            <input @change="handleLoanFileUpload" type="file" class="text-[10px] text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-700 cursor-pointer">
          </div>
        </div>

        <div class="flex-grow p-6 flex flex-col overflow-hidden">
  <div class="flex justify-between items-center mb-4">
    <h4 class="text-[11px] font-black text-slate-400 uppercase">Installment Schedule Preview</h4>
    <span class="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded italic">
      * You can manually adjust Date, Principal and Profit
    </span>
  </div>
  
  <div class="flex-grow overflow-y-auto custom-scrollbar border border-slate-100 rounded-2xl">
    <table class="w-full text-left text-sm">
      <thead class="bg-slate-50 sticky top-0 z-10">
        <tr>
          <th class="px-4 py-3 text-[10px] font-black uppercase text-slate-400 text-center w-10">#</th>
          <th class="px-4 py-3 text-[10px] font-black uppercase text-slate-400">Due Date</th>
          <th class="px-4 py-3 text-[10px] font-black uppercase text-slate-400">Principal (৳)</th>
          <th class="px-4 py-3 text-[10px] font-black uppercase text-slate-400">Profit (৳)</th>
          <th class="px-4 py-3 text-[10px] font-black uppercase text-slate-400 text-right">Total</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-50">
        <tr v-for="(ins, index) in installments" :key="index" class="hover:bg-slate-50/30 transition-colors">
          <td class="px-4 py-3 font-bold text-slate-300 text-center">{{ index + 1 }}</td>
          <td class="px-4 py-3">
            <input v-model="ins.due_date" type="date" class="w-full bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-500 outline-none font-medium transition-all text-xs">
          </td>
          <td class="px-4 py-3">
            <input v-model.number="ins.principal_amount" type="number" class="w-full bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all">
          </td>
          <td class="px-4 py-3">
            <input v-model.number="ins.interest_amount" type="number" class="w-full bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all">
          </td>
          <td class="px-4 py-3 text-right font-black text-indigo-600">
            ৳ {{ (ins.principal_amount || 0) + (ins.interest_amount || 0) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center shrink-0">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <span class="text-[10px] text-slate-400 uppercase font-black">Total Payable:</span>
        <span class="text-lg font-black text-slate-800">৳ {{ calculateCurrentTotal }}</span>
      </div>
      <p v-if="calculateCurrentTotal !== (loanForm.principal + loanForm.total_interest)" class="text-[9px] text-red-500 font-bold italic">
        ⚠️ Total installments (৳{{ calculateCurrentTotal }}) does not match Total Loan (৳{{ loanForm.principal + loanForm.total_interest }})
      </p>
    </div>
    <button @click="submitNewLoan" class="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black uppercase shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
      Save Loan Record
    </button>
  </div>
</div>
        
      </div>
    </div>
  </div>
</Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../api';

const activeTab = ref('pending');
const pendingInstallments = ref([]);
const summary = ref({ total_debt: 0, total_paid: 0, total_remaining: 0 });
const showPayModal = ref(false);
const selectedInst = ref({});

const payForm = ref({
  amount: 0,
  date: new Date().toISOString().substr(0, 10)
});

const fetchPending = async () => {
  const res = await api.get('/external-loans/pending-installments');
  pendingInstallments.value = res.data;
};

const openPayModal = (item) => {
  selectedInst.value = item;
  payForm.value.amount = item.remaining_to_pay;
  showPayModal.value = true;
};

const submitRepayment = async () => {
  if(payForm.value.amount >selectedInst.value.installment_amount){
    alert(`Payment Amount should be less than or equal due amount`)
    return
  }
  else {
    try {
      await api.post(`/external-loans/repay-installment/${selectedInst.value.schedule_id}?amount_paid=${payForm.value.amount}&payment_date=${payForm.value.date}`);
      showPayModal.value = false;
      fetchPending();
      alert("Payment Successful!");
    } catch (err) {
    alert("Payment failed!");
    }
  }
  
};

//const formatDate = (d) => new Date(d).toLocaleDateString('en-GB');

const showAddLoanModal = ref(false);
const installments = ref([]); // কিস্তির লিস্ট
const loanForm = ref({
  lender_name: '',
  principal: 0,
  total_interest: 0,
  issued_date: new Date().toISOString().substr(0, 10),
  installment_count: 1,
  file: null
});

const calculateCurrentTotal = computed(() => {
  return installments.value.reduce((sum, item) => {
    return sum + (Number(item.principal_amount) || 0) + (Number(item.interest_amount) || 0);
  }, 0);
});

const openAddLoanModal = () => {
  showAddLoanModal.value = true;
  generateSchedule();
  resetLoanForm();
};

const resetLoanForm = () => {
  loanForm.value = {
    lender_name: '',
    principal: 0,
    total_interest: 0,
    issued_date: new Date().toISOString().substr(0, 10),
    installment_count: 1,
    file: null
  };
  installments.value = [];
  // যদি ফাইলে ইনপুট থাকে তবে সেটিও রিসেট করতে হতে পারে
  // (ঐচ্ছিক: document.querySelector('input[type="file"]').value = "")
};

// কিস্তি অটো-জেনারেট করার লজিক
const generateSchedule = () => {
  if (loanForm.value.installment_count <= 0) return;
  
  const perPrincipal = Math.round(loanForm.value.principal / loanForm.value.installment_count);
  const perInterest = Math.round(loanForm.value.total_interest / loanForm.value.installment_count);
  
  const newSchedules = [];
  let currentDate = new Date(loanForm.value.issued_date);

  for (let i = 0; i < loanForm.value.installment_count; i++) {
    // প্রতি কিস্তি ১ মাস পর পর (আপনি চাইলে এটি চেঞ্জ করতে পারেন)
    currentDate.setMonth(currentDate.getMonth() + 1);
    
    newSchedules.push({
      due_date: currentDate.toISOString().substr(0, 10),
      principal_amount: perPrincipal,
      interest_amount: perInterest
    });
  }
  installments.value = newSchedules;
};

const handleLoanFileUpload = (e) => {
  loanForm.value.file = e.target.files[0];
};

const submitNewLoan = async () => {
  if (!loanForm.value.lender_name || loanForm.value.principal <= 0) {
    alert("Please fill in basic loan details");
    return;
  }
  const expectedTotal = loanForm.value.principal + loanForm.value.total_interest;
  const currentTotal = calculateCurrentTotal.value;

  if (currentTotal !== expectedTotal) {
    alert(
      `সতর্কবার্তা:\n` +
      `আপনার কিস্তির মোট যোগফল (৳${currentTotal}) মূল লোন ও লভ্যাংশ সমান (৳${expectedTotal}) নয়।\n\n` +
      `বিস্তারিত:\n` +
      `- আসল (Principal): ৳${loanForm.value.principal}\n` +
      `- মোট লভ্যাংশ (Profit): ৳${loanForm.value.total_interest}\n` +
      `- কিস্তিগুলোর যোগফল: ৳${currentTotal}\n\n`
      
    );    
    return;
  }
  const formData = new FormData();
  formData.append('lender_name', loanForm.value.lender_name);
  formData.append('principal', Number(loanForm.value.principal)); // নিশ্চিত করুন এটি Number
  formData.append('total_interest', Number(loanForm.value.total_interest)); // নিশ্চিত করুন এটি Number
  formData.append('issued_date', loanForm.value.issued_date);
  
  // গুরুত্বপূর্ণ: ফাইল না থাকলে সেটি append করবেন না
  if (loanForm.value.file && loanForm.value.file instanceof File) {
    formData.append('file', loanForm.value.file);
  }

  // কিস্তিগুলো JSON স্ট্রিং হিসেবে
  formData.append('installments_json', JSON.stringify(installments.value));

  try {
    const response = await api.post('/external-loans/add-loan', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    showAddLoanModal.value = false;
    alert("Loan created successfully!");
    fetchPending(); 
  } catch (err) {
    console.error("Payload mismatch or validation error:", err.response?.data);
    alert(`Error: ${err.response?.data?.detail[0]?.msg || "Failed to save loan"}`);
  }
};

const stats = ref({
  total_debt: 0,
  total_paid: 0,
  total_remaining: 0,
  this_month_due: 0,
  active_count: 0,
  closed_count: 0
});

const activeLoans = ref([]);
const closedLoans = ref([]);
const loading = ref(false);
const showDrawer = ref(false); // শিডিউল ড্রয়ার কন্ট্রোল
const selectedLoan = ref({}); // ড্রয়ারে যে লোনের তথ্য দেখাবে

// ড্যাশবোর্ড ডাটা ফেচ করা
const fetchDashboardData = async () => {
  loading.value = true;
  try {
    const response = await api.get('/external-loans/dashboard-summary');
    
    // ডাটা সেট করা
    stats.value = response.data.summary;
    activeLoans.value = response.data.active_loans;
    closedLoans.value = response.data.closed_loans;
    
  } catch (error) {
    console.error("Dashboard Error:", error);
    alert("ড্যাশবোর্ড ডাটা লোড করতে সমস্যা হয়েছে।");
  } finally {
    loading.value = false;
  }
};

const openSchedule = (loan) => {
  // টেবিল থেকে যে লোনটি ক্লিক করা হয়েছে, তার সব ডাটা (শিডিউলসহ) এখানে জমা হবে
  selectedLoan.value = loan;
  showDrawer.value = true;
};

// তারিখ ফরমেটিং (DD/MM/YYYY)
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

// মাউন্টেড হওয়ার সময় ডাটা নিয়ে আসা
onMounted(() => {
  fetchDashboardData();
  fetchPending();
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
</style>