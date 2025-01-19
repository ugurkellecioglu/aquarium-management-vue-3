import { Component } from 'vue'
import ClockIcon from './ClockIcon.vue'
import GaugeIcon from './GaugeIcon.vue'
import PauseIcon from './PauseIcon.vue'
import PlayIcon from './PlayIcon.vue'

export type IconNames = 'Clock' | 'Gauge' | 'Pause' | 'Play'

const Icons: Record<IconNames, Component> = {
  Clock: ClockIcon,
  Gauge: GaugeIcon,
  Pause: PauseIcon,
  Play: PlayIcon,
}

export default Icons
