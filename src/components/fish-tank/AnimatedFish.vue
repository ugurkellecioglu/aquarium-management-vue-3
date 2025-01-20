<script setup lang="ts">
import IconComponent from '@/components/icon/IconComponent.vue'
import { useFish } from '@/composables/useFish'
import { useSimulatorStore } from '@/stores/simulator'
import type { ExtendedFish } from '@/types/fish'
import anime from 'animejs'
import { defineAsyncComponent, onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue'
import type { IconNames } from '../icon/icons'

const Popover = defineAsyncComponent(() => import('primevue/popover'))

const props = defineProps<{
  fish: ExtendedFish
  tankDimensions: {
    width: number
    height: number
    left: number
    top: number
    borderWidth: number
    sandHeight: number
  }
}>()

// Store setup
const simulatorStore = useSimulatorStore()
const { isRunning, isPaused } = toRefs(simulatorStore)
const { pauseSimulation, resumeSimulation } = simulatorStore

const fishElement = ref<HTMLDivElement | null>(null)
const currentX = ref(0)
const currentY = ref(0)
const currentAnimation = ref<anime.AnimeInstance | null>(null)

const FISH_WIDTH = 80
const FISH_HEIGHT = 32
const popover = ref<InstanceType<typeof Popover> | null>(null)

function getRandomPosition() {
  const availableWidth =
    props.tankDimensions.width - props.tankDimensions.borderWidth * 2 - FISH_WIDTH
  const availableHeight =
    props.tankDimensions.height - props.tankDimensions.sandHeight - FISH_HEIGHT

  return {
    x: props.tankDimensions.borderWidth + Math.random() * availableWidth,
    y: Math.random() * (availableHeight - 40) + 20,
  }
}

function startSwimming() {
  if (!fishElement.value || !isRunning.value || isPaused.value || isFishDead.value) return

  // Stop any existing animation
  if (currentAnimation.value) {
    currentAnimation.value.pause()
  }

  // Get new target position
  const target = getRandomPosition()

  // Calculate if fish should flip based on target direction
  const shouldFlip = target.x < currentX.value

  // Create new animation
  currentAnimation.value = anime({
    targets: fishElement.value,
    left: target.x,
    top: target.y,
    duration: 3000 + Math.random() * 2000, // Random duration between 3-5 seconds
    easing: 'easeInOutQuad',
    update: function () {
      if (fishElement.value) {
        currentX.value = parseFloat(fishElement.value.style.left)
        currentY.value = parseFloat(fishElement.value.style.top)
      }
    },
    complete: function () {
      if (isRunning.value && !isPaused.value) {
        startSwimming() // Start next movement
      }
    },
  })

  // Update fish direction
  if (fishElement.value) {
    fishElement.value.style.transform = shouldFlip ? 'scaleX(-1)' : 'scaleX(1)'
  }
}

// Watch simulation state
watch(
  [isRunning, isPaused],
  ([running, paused]) => {
    if (running && !paused) {
      startSwimming()
    } else if (currentAnimation.value) {
      // Pause the animation and set current position to where the fish actually is
      currentAnimation.value.pause()
      if (fishElement.value) {
        // Get current position from the element's computed style
        const computedStyle = window.getComputedStyle(fishElement.value)
        const currentLeft = parseFloat(computedStyle.left)
        const currentTop = parseFloat(computedStyle.top)

        // Update element position and our tracking variables
        fishElement.value.style.left = `${currentLeft}px`
        fishElement.value.style.top = `${currentTop}px`
        currentX.value = currentLeft
        currentY.value = currentTop
      }
    }
  },
  { immediate: true },
)

onMounted(() => {
  // Set initial position
  const initialPos = getRandomPosition()
  currentX.value = initialPos.x
  currentY.value = initialPos.y

  if (fishElement.value) {
    fishElement.value.style.left = `${initialPos.x}px`
    fishElement.value.style.top = `${initialPos.y}px`
  }
})

onBeforeUnmount(() => {
  if (currentAnimation.value) {
    currentAnimation.value.pause()
    currentAnimation.value = null
  }
})

function onClickFish(event: MouseEvent) {
  if (isRunning.value && !isPaused.value) {
    pauseSimulation()
  }
  popover.value?.show(event)
}

// When the popover hides
function onPopoverHide() {
  if (isPaused.value) {
    resumeSimulation()
  }
}

function onPopoverShow() {
  // setTimeout is used to ensure that this code block is executed after
  // @hide event is fired from popover but at the same time another fish's popover's @show event is fired
  // otherwise, the simulation will be paused and resumed again
  setTimeout(() => {
    if (isRunning.value && !isPaused.value) {
      pauseSimulation()
    }
  })
}

const {
  healthStatus,
  timeSinceLastFeed,
  handleFeed,
  recommendedDailyFeeding,
  recommendedPerMeal,
  feedingAdvice,
  isFishDead,
  feedingAmount,
} = useFish(props.fish)

// Add watch for health status
watch(
  () => isFishDead.value,
  (newStatus) => {
    if (newStatus && fishElement.value) {
      // Stop any current animation
      if (currentAnimation.value) {
        currentAnimation.value.pause()
      }

      // Animate to surface and rotate
      currentAnimation.value = anime({
        targets: fishElement.value,
        top: props.tankDimensions.borderWidth + 10, // Float near the top
        rotateZ: 110, // pick your desired degree of rotation
        duration: 3000,
        easing: 'easeOutQuad',
      })
    }
  },
  { immediate: true },
)
</script>

<template>
  <div
    ref="fishElement"
    class="absolute z-50 p-4 rounded-xl w-24 cursor-pointer fish-element"
    :class="{ 'grayscale opacity-50': isFishDead }"
    @click="onClickFish($event)"
  >
    <IconComponent :name="props.fish.type as IconNames" class="w-full h-full" />
  </div>

  <Popover
    class="popover"
    ref="popover"
    :dismissable="true"
    @hide="onPopoverHide"
    @show="onPopoverShow"
  >
    <div class="px-4 py-2 rounded-lg bg-white border shadow-lg text-black w-64">
      <div class="text-lg font-bold">{{ props.fish.name }} - {{ props.fish.type }}</div>
      <div class="text-sm text-gray-500">Ağırlık: {{ props.fish.weight }} g</div>
      <div class="text-sm text-gray-500">
        Beslenme Aralığı: {{ props.fish.feedingSchedule.intervalInHours }} saat
      </div>
      <div class="text-sm text-gray-500">
        Günlük Önerilen Beslenme: {{ recommendedDailyFeeding }} g/gün
      </div>
      <div class="text-sm text-gray-500">
        Öğünlük Önerilen Beslenme: {{ recommendedPerMeal }} g/öğün
      </div>
      <div class="text-sm text-gray-500">Bugün Beslenme: {{ props.fish.todayFeedingAmount }} g</div>
      <div class="text-sm text-gray-500">En son {{ timeSinceLastFeed }}</div>
      <div :class="healthStatus.class" class="text-sm">Sağlık Durumu: {{ healthStatus.text }}</div>
      <div class="mt-2">
        <div class="text-sm">Beslenme Tavsiyesi</div>
        <div class="text-sm text-gray-500" v-if="!isFishDead">{{ feedingAdvice }}</div>
      </div>
      <div class="feeding-controls flex items-center mt-2">
        <input
          type="number"
          v-model="feedingAmount"
          class="feeding-amount w-16 mr-2 border rounded"
          :disabled="!isRunning || isFishDead"
          :step="0.1"
          :min="0"
        />
        <span class="unit mr-2">g</span>
        <button
          class="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          @click.stop="handleFeed"
          :disabled="!isRunning || isFishDead"
        >
          Besle
        </button>
      </div>
    </div>
  </Popover>
</template>
