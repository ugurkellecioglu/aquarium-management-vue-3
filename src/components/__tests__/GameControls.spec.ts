import { useSimulatorStore } from '@/stores/simulator'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import GameControls from '../game-manager/GameControls.vue'

describe('GameControls', () => {
  const startSimulationSpy = vi.fn()
  const stopSimulationSpy = vi.fn()

  beforeEach(() => {
    setActivePinia(createPinia())
    const simulator = useSimulatorStore()
    // Clear mock history
    startSimulationSpy.mockClear()
    stopSimulationSpy.mockClear()
    simulator.startSimulation = startSimulationSpy
    simulator.stopSimulation = stopSimulationSpy
  })

  it('renders all control components properly', () => {
    const wrapper = mount(GameControls)

    // Check if GameClock component exists
    expect(wrapper.findComponent({ name: 'GameClock' }).exists()).toBe(true)

    // Check if SpeedControls component exists
    expect(wrapper.findComponent({ name: 'SpeedControls' }).exists()).toBe(true)

    // Check if both control buttons exist
    const buttons = wrapper.findAll('.flex.gap-2 > button')
    expect(buttons).toHaveLength(2)
    expect(buttons[0].text()).toContain('Başlat')
    expect(buttons[1].text()).toContain('Durdur')
  })

  it('handles start button click correctly', async () => {
    const wrapper = mount(GameControls)

    const startButton = wrapper.findAll('.flex.gap-2 > button')[0]
    await startButton.trigger('click')

    expect(startSimulationSpy).toHaveBeenCalled()
  })

  it('handles stop button click correctly', async () => {
    const wrapper = mount(GameControls)
    const simulator = useSimulatorStore()

    // Set simulation as running so stop button is enabled
    simulator.$patch({ isRunning: true })
    await wrapper.vm.$nextTick()

    const stopButton = wrapper.findAll('.flex.gap-2 > button')[1]
    // Verify button exists and is clickable
    expect(stopButton.exists()).toBe(true)
    expect(stopButton.attributes('disabled')).toBeUndefined()
    await stopButton.trigger('click')

    expect(stopSimulationSpy).toHaveBeenCalled()
  })

  it('disables start button when simulation is running', async () => {
    const wrapper = mount(GameControls)
    const simulator = useSimulatorStore()

    simulator.$patch({ isRunning: true })
    await wrapper.vm.$nextTick()

    const startButton = wrapper.findAll('.flex.gap-2 > button')[0]
    expect(startButton.attributes('disabled')).toBeDefined()
    expect(startButton.classes()).toContain('disabled:opacity-50')
    expect(startButton.classes()).toContain('disabled:cursor-not-allowed')
  })

  it('disables stop button when simulation is not running', async () => {
    const wrapper = mount(GameControls)
    const simulator = useSimulatorStore()

    simulator.$patch({ isRunning: false })
    await wrapper.vm.$nextTick()

    const stopButton = wrapper.findAll('.flex.gap-2 > button')[1]
    expect(stopButton.attributes('disabled')).toBeDefined()
    expect(stopButton.classes()).toContain('disabled:opacity-50')
    expect(stopButton.classes()).toContain('disabled:cursor-not-allowed')
  })

  it('passes correct disabled prop to SpeedControls', async () => {
    const wrapper = mount(GameControls)
    const simulator = useSimulatorStore()

    // When simulation is not running
    simulator.$patch({ isRunning: false })
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent({ name: 'SpeedControls' }).props('disabled')).toBe(true)

    // When simulation is running
    simulator.$patch({ isRunning: true })
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent({ name: 'SpeedControls' }).props('disabled')).toBe(false)
  })
})
