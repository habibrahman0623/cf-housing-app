<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div>
        <h2 class="text-xl font-black text-slate-800 uppercase tracking-tight">Bill Collection</h2>
        <p class="text-xs text-gray-500 font-medium">বকেয়া বিল সংগ্রহ করুন এবং রশিদ প্রদান করুন</p>
      </div>
      <div class="relative">
        <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search Member Code..." 
          class="pl-10 pr-4 py-2 border-2 border-gray-100 rounded-xl outline-none focus:border-emerald-500 transition-all text-sm w-64"
        >
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50 text-[10px] uppercase text-slate-500 font-bold tracking-widest">
            <tr>
              <th class="px-6 py-4">Member</th>
              <th class="px-6 py-4">Monthly Due (P+F)</th>
              <th class="px-6 py-4">Special Due (P+F)</th>
              <th class="px-6 py-4">Total Payable</th>
              <th class="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm">
            <tr v-if="isLoading">
              <td colspan="5" class="py-10 text-center text-gray-400 font-bold">লোড হচ্ছে... ⏳</td>
            </tr>
            <tr v-else-if="filteredDefaulters.length === 0">
              <td colspan="5" class="py-10 text-center text-gray-400 font-bold">কোন বকেয়া মেম্বার পাওয়া যায়নি। 🕊️</td>
            </tr>
            <tr v-for="member in filteredDefaulters" :key="member.Id" class="hover:bg-slate-50/50 transition-colors">
              <td class="px-6 py-4">
                <div class="font-black text-slate-700 uppercase">{{ member.Name }}</div>
                <div class="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded w-fit mt-1 font-bold">
                  {{ member['Member Code'] }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-slate-600 font-bold">৳ {{ member['Monthly Due'] }}</div>
                <div class="text-[10px] text-orange-500 font-bold">Fine: ৳ {{ member['Monthly Fine Due'] }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-slate-600 font-bold">৳ {{ member['Special Due'] }}</div>
                <div class="text-[10px] text-orange-500 font-bold">Fine: ৳ {{ member['Special Fine Due'] }}</div>
              </td>
              <td class="px-6 py-4">
                <span class="text-lg font-black text-red-600">৳ {{ member['Total Due'] }}</span>
              </td>
              <td class="px-6 py-4 text-center">
                <button 
                  @click="handlePayment(member)"
                  class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-black shadow-lg shadow-emerald-100 transition-all uppercase tracking-wider"
                >
                  Collect 💰
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../api';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import { usePayment } from '../composables/usePayment';

const { collectPayment } = usePayment();

const defaulters = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');

// ১. বকেয়া লিস্ট ফেচ করা
const fetchDefaulters = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('/reports/defaulter-list');
    defaulters.value = response.data.defaulters;
  } catch (err) {
    alert("লিস্ট লোড করতে সমস্যা হয়েছে।");
  } finally {
    isLoading.value = false;
  }
};

// ২. সার্চ ফিল্টারিং
const filteredDefaulters = computed(() => {
  return defaulters.value.filter(m => 
    m['Member Code'].toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    m.Name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// ৩. পেমেন্ট নেওয়া
const handlePayment = async (member) => {
  // মেম্বার আইডি এবং নাম পাঠিয়ে দিন
  const success = await collectPayment(member['Id'], member['Name'], member['Total Due'] || 0);
  
  if (success) {
    // পেমেন্ট সফল হওয়ার পর যদি লিস্ট রিফ্রেশ করতে চান
    fetchDefaulters(); 
  }
};

// const initiatePayment = async (member) => {
//   const amount = prompt(`মেম্বার: ${member.Name}\nমোট বকেয়া: ৳${member['Total Due']}\nজমা দেওয়া টাকার পরিমাণ লিখুন:`, member['Total Due']);
  
//   if (amount === null || amount === "" || isNaN(amount)) return;

//   try {
//     const response = await api.post('/payments/collect', {
//       member_id: member.Id,
//       cash_received: parseFloat(amount)
//     });

//     alert("পেমেন্ট সফলভাবে সম্পন্ন হয়েছে!");
//     generateReceiptPDF(response.data); // পিডিএফ জেনারেট
//     fetchDefaulters(); // টেবিল রিফ্রেশ
//   } catch (err) {
//     alert(err.response?.data?.detail || "পেমেন্ট প্রসেস করা সম্ভব হয়নি।");
//   }
// };

// // ৪. পিডিএফ রশিদ তৈরি (Professional Look)
// const generateReceiptPDF = (data) => {
//   try {
//     const doc = new jsPDF();
    
//     // Header
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(22);
//     doc.setTextColor(16, 185, 129);
//     doc.text("CF HOUSING SOCIETY", 105, 20, { align: "center" });
    
//     doc.setFontSize(10);
//     doc.setTextColor(100);
//     doc.text("Official Payment Receipt", 105, 28, { align: "center" });
    
//     doc.setDrawColor(230);
//     doc.line(20, 35, 190, 35);
    
//     // Info
//     doc.setFontSize(11);
//     doc.setTextColor(0);
//     // ডাটা কী-গুলো আপনার রেসপন্স অনুযায়ী নিশ্চিত করা হয়েছে
//     doc.text(`Receipt No: ${data.receipt_no || 'N/A'}`, 20, 45);
//     doc.text(`Date: ${new Date().toLocaleString()}`, 130, 45);
    
//     // Table Data
//     autoTable(doc, { // এখানে সরাসরি doc.autoTable এর বদলে autoTable(doc, ...) ব্যবহার করুন
//       startY: 55,
//       body: [
//         ["Member Name", String(data.member_name)],
//         ["Member Code", String(data.member_code)],
//         ["Amount Received", `TK. ${data.payment_amount}/-`],
//         ["Advance Balance", `TK. ${data.new_advance_balance}/-`],
//         ["Status", "Payment collected and bills adjusted"]
//       ],
//       theme: 'grid',
//       headStyles: { fillColor: [16, 185, 129] },
//       styles: { fontSize: 10, cellPadding: 5 }
//     });

//     // ফুটার পজিশন ঠিক করা
//     const finalY = doc.lastAutoTable.finalY + 30;
//     doc.text("_______________________", 20, finalY);
//     doc.text("Member Signature", 20, finalY + 5);
    
//     doc.text("_______________________", 140, finalY);
//     doc.text("Authorized Signature", 140, finalY + 5);

//     doc.save(`Receipt_${data.member_code}.pdf`);
    
//   } catch (pdfError) {
//     console.error("PDF Error Details:", pdfError);
//     alert("PDF তৈরিতে সমস্যা হয়েছে। কনসোল দেখুন।");
//   }
// };

onMounted(fetchDefaulters);
</script>