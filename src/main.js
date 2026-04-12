import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // আপনার রাউটার ফাইল ইম্পোর্ট করুন
import './style.css' // আপনার টেইলউইন্ড বা সিএসএস

const app = createApp(App)
app.use(router) // এটি অত্যন্ত গুরুত্বপূর্ণ
app.mount('#app')