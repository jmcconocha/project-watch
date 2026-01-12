import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification'
import { isTauri } from './tauri'

export interface NotificationOptions {
  title: string
  body: string
  icon?: string
}

let permissionGranted = false

/**
 * Initialize notification permissions
 */
export async function initNotifications(): Promise<boolean> {
  if (!isTauri()) {
    return false
  }

  try {
    permissionGranted = await isPermissionGranted()

    if (!permissionGranted) {
      const permission = await requestPermission()
      permissionGranted = permission === 'granted'
    }

    return permissionGranted
  } catch (error) {
    console.warn('Failed to initialize notifications:', error)
    return false
  }
}

/**
 * Send a native notification
 */
export async function notify(options: NotificationOptions): Promise<void> {
  if (!isTauri()) {
    console.log('[Mock Notification]', options.title, '-', options.body)
    return
  }

  if (!permissionGranted) {
    const granted = await initNotifications()
    if (!granted) {
      console.warn('Notification permission not granted')
      return
    }
  }

  try {
    await sendNotification({
      title: options.title,
      body: options.body,
    })
  } catch (error) {
    console.error('Failed to send notification:', error)
  }
}

// Pre-built notification types

export async function notifyUncommittedChanges(
  projectName: string,
  fileCount: number
): Promise<void> {
  await notify({
    title: 'Uncommitted Changes',
    body: `${projectName} has ${fileCount} uncommitted file${fileCount !== 1 ? 's' : ''}`,
  })
}

export async function notifyPRUpdate(
  projectName: string,
  prCount: number
): Promise<void> {
  await notify({
    title: 'Pull Request Update',
    body: `${projectName} has ${prCount} open PR${prCount !== 1 ? 's' : ''}`,
  })
}

export async function notifyBehindRemote(
  projectName: string,
  commitCount: number
): Promise<void> {
  await notify({
    title: 'Behind Remote',
    body: `${projectName} is ${commitCount} commit${commitCount !== 1 ? 's' : ''} behind origin`,
  })
}

export async function notifyGitStatusChange(
  projectName: string,
  message: string
): Promise<void> {
  await notify({
    title: projectName,
    body: message,
  })
}
