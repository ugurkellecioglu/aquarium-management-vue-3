export const SIMULATION_SPEEDS = [1, 60, 120, 3600] as const
export type SimulationSpeed = (typeof SIMULATION_SPEEDS)[number]

export const SPEED_PRESETS = [
  { value: 1, label: '1x' },
  { value: 60, label: '1m/s' },
  { value: 120, label: '2m/s' },
  { value: 3600, label: '1h/s' },
] as const

export type SpeedPreset = (typeof SPEED_PRESETS)[number]
