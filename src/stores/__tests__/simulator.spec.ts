import { SIMULATION_SPEEDS } from '@/constants/simulation'
import { useSimulatorStore } from '@/stores/simulator'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('Simulator Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // Reset timers before each test
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('initializes with default values', () => {
    const simulator = useSimulatorStore()
    expect(simulator.isRunning).toBe(false)
    expect(simulator.isPaused).toBe(false)
    expect(simulator.speed).toBe(1)
    expect(simulator.intervalId).toBe(null)
  })

  it('starts simulation correctly', () => {
    const simulator = useSimulatorStore()
    simulator.startSimulation()

    expect(simulator.isRunning).toBe(true)
    expect(simulator.isPaused).toBe(false)
    expect(simulator.intervalId).not.toBe(null)
  })

  it('stops simulation correctly', () => {
    const simulator = useSimulatorStore()
    simulator.startSimulation()
    simulator.stopSimulation()

    expect(simulator.isRunning).toBe(false)
    expect(simulator.isPaused).toBe(false)
    expect(simulator.intervalId).toBe(null)
  })

  it('pauses and resumes simulation', () => {
    const simulator = useSimulatorStore()
    simulator.startSimulation()
    simulator.pauseSimulation()

    expect(simulator.isPaused).toBe(true)
    expect(simulator.isRunning).toBe(true)

    simulator.resumeSimulation()
    expect(simulator.isPaused).toBe(false)
    expect(simulator.isRunning).toBe(true)
  })

  it('updates time correctly when running', () => {
    const simulator = useSimulatorStore()
    const initialTime = simulator.currentTime.getTime()

    simulator.startSimulation()
    vi.advanceTimersByTime(1000) // Advance by 1 second

    expect(simulator.currentTime.getTime()).toBe(initialTime + 1000)
  })

  it('respects simulation speed', () => {
    const simulator = useSimulatorStore()
    const initialTime = simulator.currentTime.getTime()

    simulator.setSpeed(SIMULATION_SPEEDS[0])
    simulator.startSimulation()
    vi.advanceTimersByTime(1000) // Advance by 1 second

    expect(simulator.currentTime.getTime()).toBe(initialTime + 1000)
  })

  it('does not update time when paused', () => {
    const simulator = useSimulatorStore()
    const initialTime = simulator.currentTime.getTime()

    simulator.startSimulation()
    simulator.pauseSimulation()
    vi.advanceTimersByTime(1000) // Advance by 1 second

    expect(simulator.currentTime.getTime()).toBe(initialTime)
  })

  it('formats time correctly', () => {
    const simulator = useSimulatorStore()
    const testDate = new Date(2024, 0, 1, 12, 30, 45) // January 1, 2024, 12:30:45
    simulator.currentTime = testDate

    expect(simulator.formattedTime).toMatch(/01\.01\.2024 12:30:45/)
  })
})
