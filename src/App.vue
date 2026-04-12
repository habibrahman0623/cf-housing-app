<template>
  <router-view></router-view>
</template>

<style>
*{
  box-sizing: border-box;
}
/* পুরো স্ক্রিন ব্যবহার করার জন্য */
html, body, #app {
  margin: 0 !important;
  padding: 0 !important;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #f3f4f6;
}
</style>