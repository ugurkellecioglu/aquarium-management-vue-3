export const SIMULATION_SPEEDS = [1, 60, 120, 3600] as const
export type SimulationSpeed = (typeof SIMULATION_SPEEDS)[number]
