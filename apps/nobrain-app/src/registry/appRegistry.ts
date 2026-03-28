import type { ComponentType } from 'react'
import { LototechApp, LototechAppPage } from '@nx-mono/lototech'
import { PollsApp, PollsAppPage } from '@nx-mono/polls-app'

export const appRegistry: Record<string, ComponentType<any>> = {
  LototechApp,
  LototechAppPage,
  PollsApp,
  PollsAppPage
}