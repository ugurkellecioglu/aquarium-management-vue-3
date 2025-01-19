import { SPEED_PRESETS } from '@/constants/simulation'
import { useSimulatorStore } from '@/stores/simulator'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import SpeedControls from '../game-manager/SpeedControls.vue'

describe('SpeedControls', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders properly with all speed preset buttons', () => {
    const wrapper = mount(SpeedControls)

    // Check if all speed preset buttons are rendered
    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(SPEED_PRESETS.length)

    // Check if each button has correct label
    SPEED_PRESETS.forEach((preset, index) => {
      expect(buttons[index].text()).toBe(preset.label)
    })
  })

  it('highlights the current speed button', async () => {
    const wrapper = mount(SpeedControls)
    const simulator = useSimulatorStore()

    // Set initial speed
    await simulator.setSpeed(SPEED_PRESETS[1].value)

    const buttons = wrapper.findAll('button')
    expect(buttons[1].classes()).toContain('bg-emerald-600')
    expect(buttons[0].classes()).toContain('bg-gray-200')
  })

  it('calls setSpeed when clicking speed buttons', async () => {
    const wrapper = mount(SpeedControls)
    const simulator = useSimulatorStore()
    const spy = vi.spyOn(simulator, 'setSpeed')

    // Click the second speed button
    await wrapper.findAll('button')[1].trigger('click')

    expect(spy).toHaveBeenCalledWith(SPEED_PRESETS[1].value)
  })

  it('disables all buttons when disabled prop is true', () => {
    const wrapper = mount(SpeedControls, {
      props: {
        disabled: true,
      },
    })

    const buttons = wrapper.findAll('button')
    buttons.forEach((button) => {
      expect(button.attributes('disabled')).toBeDefined()
      expect(button.classes()).toContain('opacity-50')
      expect(button.classes()).toContain('cursor-not-allowed')
    })
  })

  it('enables all buttons when disabled prop is false', () => {
    const wrapper = mount(SpeedControls, {
      props: {
        disabled: false,
      },
    })

    const buttons = wrapper.findAll('button')
    buttons.forEach((button) => {
      expect(button.attributes('disabled')).toBeUndefined()
      expect(button.classes()).toContain('cursor-pointer')
    })
  })
})
