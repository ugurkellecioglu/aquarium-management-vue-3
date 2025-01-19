import { useSimulatorStore } from '@/stores/simulator'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import GameClock from '../game-manager/GameClock.vue'

describe('GameClock', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders properly with all clock elements', () => {
    const wrapper = mount(GameClock)

    // Check if clock icon exists
    expect(wrapper.findComponent({ name: 'ClockIcon' }).exists()).toBe(true)

    // Check if label exists
    expect(wrapper.text()).toContain('Zaman:')

    // Check if all time segments exist
    const timeSegments = wrapper.findAll('.w-10.h-8')
    expect(timeSegments).toHaveLength(3) // hours, minutes, seconds
  })

  it('displays correct time segments from simulator store', async () => {
    const wrapper = mount(GameClock)
    const simulator = useSimulatorStore()

    // Mock the formattedTime value
    simulator.$patch({ currentTime: new Date('2024-03-20T14:30:45') })

    // Wait for the next tick to ensure computed properties are updated
    await wrapper.vm.$nextTick()

    // Find all time segment containers
    const timeSegments = wrapper.findAll('.w-10.h-8')

    // Check if each segment displays correct time
    expect(timeSegments[0].text()).toBe('14')
    expect(timeSegments[1].text()).toBe('30')
    expect(timeSegments[2].text()).toBe('45')
  })

  it('updates display when simulator time changes', async () => {
    const wrapper = mount(GameClock)
    const simulator = useSimulatorStore()

    // Initial time
    simulator.$patch({ currentTime: new Date('2024-03-20T10:20:30') })
    await wrapper.vm.$nextTick()

    const timeSegments = wrapper.findAll('.w-10.h-8')
    expect(timeSegments[0].text()).toBe('10')
    expect(timeSegments[1].text()).toBe('20')
    expect(timeSegments[2].text()).toBe('30')

    // Change time
    simulator.$patch({ currentTime: new Date('2024-03-20T11:45:15') })
    await wrapper.vm.$nextTick()

    expect(timeSegments[0].text()).toBe('11')
    expect(timeSegments[1].text()).toBe('45')
    expect(timeSegments[2].text()).toBe('15')
  })

  it('applies correct styling to time segments', () => {
    const wrapper = mount(GameClock)

    const timeSegments = wrapper.findAll('.w-10.h-8')
    timeSegments.forEach((segment) => {
      // Check container styling
      expect(segment.classes()).toContain('bg-gray-100')
      expect(segment.classes()).toContain('border')
      expect(segment.classes()).toContain('border-gray-200')
      expect(segment.classes()).toContain('rounded')

      // Check time text styling
      const timeText = segment.find('.text-emerald-600')
      expect(timeText.exists()).toBe(true)
    })

    // Check separator styling
    const separators = wrapper.findAll('.text-gray-400')
    expect(separators).toHaveLength(2)
    separators.forEach((separator) => {
      expect(separator.text()).toBe(':')
    })
  })
})
