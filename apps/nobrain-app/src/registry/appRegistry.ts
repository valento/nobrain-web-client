// apps/nobrain-app/src/registry/appRegistry.ts
import type { ComponentType } from 'react'
import { LototechApp } from '@nx-mono/lototech'

export const appRegistry: Record<string, ComponentType<{ mode?: 'widget' | 'full' }>> = {
  LototechApp,
}