<script setup lang="ts">
import { computed } from 'vue'
import Icons, { type IconNames } from './icons'

interface IconComponentProps {
  name: IconNames
  size?: string | number
}
const props = defineProps<IconComponentProps>()
const icon = computed(() => Icons[props.name])

const size = computed(() => {
  switch (props.size) {
    case 'xs':
      return '16'
    case 'sm':
      return '24'
    case 'md':
      return '32'
    case 'lg':
      return '48'
    case 'xl':
      return '64'
    default:
      return props.size
  }
})
</script>

<template>
  <component :is="icon" :width="size" :height="size" />
</template>
