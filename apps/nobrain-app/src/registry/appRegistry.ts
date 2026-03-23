// apps/nobrain-app/src/registry/appRegistry.ts
import type { ComponentType } from 'react'
import { LototechApp } from '@nx-mono/lototech'
import { PollsApp } from '@nx-mono/polls-app'

export const appRegistry: Record<string, ComponentType<any>> = {
  LototechApp,
  PollsApp
}