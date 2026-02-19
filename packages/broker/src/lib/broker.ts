export interface User {
  id: string
  email: string
  name?: string
}

export interface EventMap {
  // Widget → Host
  'auth:login-success': { token: string; user: User }
  'auth:logout': void
  'auth:error': { message: string }

  // Host → Widget
  'widget:close': void
  'user:changed': User | null

  // UI events
  'ui:show-login': { visible: boolean }
}

type Callback<T = unknown> = (data: T) => void

class Broker {
  private subscribers: Map<string, Set<Callback>> = new Map()

  on<K extends keyof EventMap>(event: K, callback: Callback<EventMap[K]>): void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set())
    }
    this.subscribers.get(event)!.add(callback as Callback)
  }

  off<K extends keyof EventMap>(event: K, callback: Callback<EventMap[K]>): void {
    this.subscribers.get(event)?.delete(callback as Callback)
  }

  emit<K extends keyof EventMap>(event: K, ...args: EventMap[K] extends void ? [] : [EventMap[K]]): void {
    this.subscribers.get(event)?.forEach(cb => cb(args[0]))
  }
}

export const broker = new Broker()