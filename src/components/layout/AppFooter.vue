<script lang="ts">
export default {
  name: 'AppFooter',
  computed: {
    currentYear() {
      return new Date().getFullYear()
    },
  },
}
</script>
<template>
  <footer class="bg-gray-100 border-t border-gray-200 py-4 mt-auto w-full">
    <div class="max-w-7xl mx-auto px-4 flex justify-between items-center">
      <p class="text-gray-600">&copy; {{ currentYear }} Balık Takip Sistemi</p>
      <p class="text-gray-600">
        <a href="https://ugurkellecioglu.com" target="_blank" class="text-blue-500 hover:underline"
          >Uğur Kellecioğlu</a
        >
        tarafından <span class="text-red-500">❤</span> ile yapıldı
      </p>
    </div>
  </footer>
</template>
