<script setup lang="ts">
const handleRestart = () => {
  window.location.reload()
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-max !m-0">
    <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Oyun Bitti!</h2>
        <div class="mb-6">
          <p class="text-gray-600">Tüm balıklar öldü. Yeni bir oyuna başlamak ister misiniz?</p>
        </div>
        <button
          @click="handleRestart"
          class="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
        >
          Yeniden Başla
        </button>
      </div>
    </div>
  </div>
</template>
