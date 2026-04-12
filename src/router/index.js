import { createRouter, createWebHistory } from 'vue-router';
import DashboardLayout from '../layouts/DashboardLayout.vue';
import LoginView from '../views/LoginView.vue';

// ভিউ ফাইলগুলো ইম্পোর্ট করা (এগুলো পরে তৈরি করে নিবেন)
import DashboardHome from '../views/DashboardHome.vue';
import MembersView from '../views/MembersView.vue';
import MonthlyBillingView from '../views/MonthlyBillingView.vue';
import SpecialBillingView from '../views/SpecialBillingView.vue';
import BillCollectionView from '../views/BillCollectionView.vue';
import ExpensesView from '../views/ExpensesView.vue';
import ReportsView from '../views/ReportsView.vue';
import SettingsView from '../views/SettingsView.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/dashboard',
    meta: { requiresAuth: true }, // এই রুটের নিচের সব পেজে লগইন লাগবে
    children: [
      { path: 'dashboard', name: 'Dashboard', component: DashboardHome },
      { path: 'members', name: 'Members', component: MembersView },
      { path: 'monthly-billing', name: 'Monthly Billing', component: MonthlyBillingView },
      { path: 'special-billing', name: 'Special Billing', component: SpecialBillingView },
      { path: 'bill-collection', name: 'Bill Collection', component: BillCollectionView },
      { path: 'expenses', name: 'Expenses', component: ExpensesView },
      { path: 'reports', name: 'Reports', component: ReportsView },
      { path: 'settings', name: 'Settings', component: SettingsView },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// --- Navigation Guard (নিরাপত্তার জন্য) ---
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token'); // টোকেন আছে কিনা চেক করা

  if (to.meta.requiresAuth && !isAuthenticated) {
    // যদি লগইন করা না থাকে এবং পেজটি সিকিউর হয়, তবে লগইনে পাঠিয়ে দাও
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    // লগইন করা থাকলে আর লগইন পেজে যেতে দিবে না, সরাসরি ড্যাশবোর্ডে পাঠাবে
    next('/dashboard');
  } else {
    next();
  }
});

export default router;