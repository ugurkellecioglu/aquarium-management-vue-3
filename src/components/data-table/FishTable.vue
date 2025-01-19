<script setup lang="ts">
import TableRow from '@/components/fish-datatable/TableRow.vue'
import type { ExtendedFish } from '@/types/fish'

defineProps<{
  fish: ExtendedFish[]
}>()
</script>

<template>
  <div class="w-full overflow-x-auto">
    <table class="w-full border-collapse bg-white shadow-sm min-w-[1200px]">
      <thead>
        <tr>
          <th class="p-3 text-left bg-gray-50 font-semibold border-b border-gray-200">Adı</th>
          <th class="p-3 text-left bg-gray-50 font-semibold border-b border-gray-200">Türü</th>
          <th class="p-3 text-left bg-gray-50 font-semibold border-b border-gray-200">Ağırlık</th>
          <th class="p-3 text-left bg-gray-50 font-semibold border-b border-gray-200">
            Beslenme Aralığı
          </th>
          <th class="p-3 text-left bg-gray-50 font-semibold border-b border-gray-200">
            Önerilen Beslenme (günlük)
          </th>
          <th class="p-3 text-left bg-gray-50 font-semibold border-b border-gray-200">
            Önerilen Beslenme (öğün)
          </th>
          <th class="p-3 text-left bg-gray-50 font-semibold border-b border-gray-200">
            Bugün Beslenen
          </th>
          <th class="p-3 text-left bg-gray-50 font-semibold border-b border-gray-200">
            Son Beslenme
          </th>
          <th class="p-3 text-left bg-gray-50 font-semibold border-b border-gray-200">
            Beslenmeye Kalan
          </th>
          <th class="p-3 text-left bg-gray-50 font-semibold border-b border-gray-200">Sağlık</th>
          <th class="p-3 text-left bg-gray-50 font-semibold border-b border-gray-200">İşlem</th>
        </tr>
      </thead>
      <tbody>
        <TableRow v-for="f in fish" :key="f.id" :fish="f" />
      </tbody>
    </table>
  </div>
</template>
