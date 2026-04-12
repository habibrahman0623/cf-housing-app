<template>
    <section class="flex-1 overflow-y-auto p-6 dashboard-bg relative">
        <div class="content-wrapper relative z-10"> 
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- আপনার কার্ডগুলো এখানে থাকবে -->
            <div class="bg-white/80 backdrop-blur-md p-6 rounded-lg shadow border-l-4 border-blue-500">
              <p class="text-sm text-gray-500 uppercase font-semibold">Total Members</p>
              <p class="text-3xl font-bold text-slate-800">60</p>
            </div>
            <div class="bg-white/80 p-6 rounded-lg shadow border-l-4 border-green-500">
            <p class="text-sm text-gray-500 uppercase">Monthly Collection</p>
            <p class="text-2xl font-bold">৳ 45,000</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
            <p class="text-sm text-gray-500 uppercase">Total Due</p>
            <p class="text-2xl font-bold">৳ 12,500</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
            <p class="text-sm text-gray-500 uppercase">Fine Pending</p>
            <p class="text-2xl font-bold">৳ 1,200</p>
          </div>
          
          </div>
          
        </div>
      </section>
</template>