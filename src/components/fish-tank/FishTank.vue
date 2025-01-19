<script setup lang="ts">
import IconComponent from '@/components/icon/IconComponent.vue'
import { useFishStore } from '@/stores/fish'
import { onMounted, reactive, ref, toRefs } from 'vue'
import AnimatedFish from './AnimatedFish.vue'
const { fish } = toRefs(useFishStore())

const tankRef = ref<HTMLDivElement | null>(null)
const tankDimensions = reactive({
  width: 0,
  height: 0,
  left: 0,
  top: 0,
  borderWidth: 15,
  sandHeight: 60,
})

onMounted(() => {
  if (tankRef.value) {
    const rect = tankRef.value.getBoundingClientRect()
    tankDimensions.width = rect.width
    tankDimensions.height = rect.height
    tankDimensions.left = rect.left
    tankDimensions.top = rect.top
  }
})
</script>

<template>
  <div class="fish-tank-container">
    <div ref="tankRef" class="fish-tank">
      <div class="relative">
        <AnimatedFish v-for="f in fish" :key="f.id" :fish="f" :tank-dimensions="tankDimensions" />
      </div>

      <div class="water">
        <div class="wave wave1"></div>
        <div class="wave wave2"></div>
        <div class="wave wave3"></div>
        <IconComponent name="SeaMoss" class="moss moss1" />
        <IconComponent name="SeaMoss" class="moss moss2" />
        <IconComponent name="SeaMossSecond" class="moss moss3" />
        <IconComponent name="SeaMossSecond" class="moss moss4" />
        <IconComponent name="SeaMossThird" class="moss moss5" />
        <IconComponent name="SeaMossThird" class="moss moss6" />
      </div>
      <div class="tank-floor">
        <div class="sand"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fish-tank-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.fish-tank {
  width: 100%;
  height: 300px;
  background: rgba(255, 255, 255, 0.2);
  border-left: 10px solid rgba(64, 164, 223, 0.3);
  border-right: 10px solid rgba(64, 164, 223, 0.3);
  border-bottom: 10px solid rgba(64, 164, 223, 0.3);
  border-radius: 15px;
  position: relative;
  overflow: hidden;
}

.water {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(64, 164, 223, 0.5) 0%, rgba(13, 96, 156, 0.6) 100%);
  position: relative;
}

.tank-floor {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px;
}

.sand {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40px;
  background: linear-gradient(180deg, #d4b483 0%, #c19a6b 100%);
}

.moss {
  --base-rotation: 8deg;
  position: absolute;
  opacity: 0.8;
  bottom: 35px;
  animation: sway 4s ease-in-out infinite;
}

.moss1 {
  width: 60px;
  height: 60px;
  left: 10%;
  transform: rotate(calc(var(--base-rotation) * 0.6));
  animation-delay: -2s;
}

.moss2 {
  width: 45px;
  height: 45px;
  left: 85%;
  transform: rotate(calc(var(--base-rotation) * -1));
  animation-delay: -1s;
}

.moss3 {
  width: 70px;
  height: 70px;
  left: 30%;
  transform: rotate(calc(var(--base-rotation) * 1.5));
  animation-delay: -3s;
}

.moss4 {
  width: 50px;
  height: 50px;
  left: 65%;
  transform: rotate(calc(var(--base-rotation) * -1.8));
  animation-delay: -4s;
}

.moss5 {
  width: 55px;
  height: 55px;
  left: 45%;
  transform: rotate(calc(var(--base-rotation)));
  animation-delay: -2.5s;
}

.moss6 {
  width: 40px;
  height: 40px;
  left: 75%;
  transform: rotate(calc(var(--base-rotation) * -1.2));
  animation-delay: -1.5s;
}

@keyframes sway {
  0%,
  100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(calc(var(--base-rotation) * 0.3));
  }
}

.fish-element {
  transition:
    filter 0.3s ease,
    brightness 0.3s ease;
}
</style>
