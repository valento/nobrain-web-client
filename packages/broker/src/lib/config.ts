export const config = {
  apiUrl: 'http://localhost:8000'
}

export function setConfig(overrides: Partial<typeof config>) {
  Object.assign(config, overrides)
}