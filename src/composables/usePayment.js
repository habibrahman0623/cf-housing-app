// src/composables/usePayment.js
import api from '../api';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export function usePayment() {
  
  // ১. পিডিএফ জেনারেট করার কমন ফাংশন
  const generateReceiptPDF = (data) => {
  try {
    const doc = new jsPDF();
    
    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(16, 185, 129);
    doc.text("CF HOUSING SOCIETY", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Official Payment Receipt", 105, 28, { align: "center" });
    
    doc.setDrawColor(230);
    doc.line(20, 35, 190, 35);
    
    // Info
    doc.setFontSize(11);
    doc.setTextColor(0);
    // ডাটা কী-গুলো আপনার রেসপন্স অনুযায়ী নিশ্চিত করা হয়েছে
    doc.text(`Receipt No: ${data.receipt_no || 'N/A'}`, 20, 45);
    doc.text(`Date: ${new Date().toLocaleString()}`, 130, 45);
    
    // Table Data
    autoTable(doc, { // এখানে সরাসরি doc.autoTable এর বদলে autoTable(doc, ...) ব্যবহার করুন
      startY: 55,
      body: [
        ["Member Name", String(data.member_name)],
        ["Member Code", String(data.member_code)],
        ["Amount Received", `TK. ${data.payment_amount}/-`],
        ["Advance Balance", `TK. ${data.new_advance_balance}/-`],
        ["Status", "Payment collected and bills adjusted"]
      ],
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] },
      styles: { fontSize: 10, cellPadding: 5 }
    });

    // ফুটার পজিশন ঠিক করা
    const finalY = doc.lastAutoTable.finalY + 30;
    doc.text("_______________________", 20, finalY);
    doc.text("Member Signature", 20, finalY + 5);
    
    doc.text("_______________________", 140, finalY);
    doc.text("Authorized Signature", 140, finalY + 5);

    doc.save(`Receipt_${data.member_code}.pdf`);
    
  } catch (pdfError) {
    console.error("PDF Error Details:", pdfError);
    alert("PDF তৈরিতে সমস্যা হয়েছে। কনসোল দেখুন।");
  }
};

  // ২. পেমেন্ট কালেক্ট করার কমন ফাংশন
  const collectPayment = async (memberId, memberName, totalDue = 0) => {
    const amount = prompt(`Member: ${memberName}\nবকেয়া: ৳${totalDue}\nজমার পরিমাণ লিখুন:`, totalDue);
    
    if (amount === null || amount === "" || isNaN(amount) || amount <= 0) return null;

    try {
      const response = await api.post('/payments/collect', {
        member_id: memberId,
        cash_received: parseFloat(amount)
      });

      alert("পেমেন্ট সফল হয়েছে!");
      generateReceiptPDF(response.data);
      return response.data; // সফল হলে ডাটা রিটার্ন করবে
    } catch (err) {
      alert(err.response?.data?.detail || "পেমেন্ট নিতে সমস্যা হয়েছে।");
      return null;
    }
  };

  return {
    collectPayment,
    generateReceiptPDF
  };
}