<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import { useProductStore } from './store/product'
import { useCodeStore } from './store/code'

const productStore = useProductStore()
const codeStore = useCodeStore()
const isActive = ref(true)

onMounted(async () => {
  await nextTick()
  if (isActive.value) {
    codeStore.generateCodesForAllProducts(productStore.products)
  }
})

onUnmounted(() => {
  isActive.value = false
})
</script>

<style scoped>
.app {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>