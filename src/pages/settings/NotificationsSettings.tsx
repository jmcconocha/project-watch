import { useState } from 'react'
import {
  NotificationsSettings as NotificationsSettingsPanel,
  sampleSettings,
  type NotificationSettings,
} from '../../features/settings'

export function NotificationsSettings() {
  const [notifications, setNotifications] = useState<NotificationSettings>(
    sampleSettings.notifications
  )

  const handleNotificationChange = (
    key: keyof NotificationSettings,
    value: boolean | number
  ) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: value,
    }))
    console.log('Notification setting changed:', key, value)
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
      <NotificationsSettingsPanel
        notifications={notifications}
        onNotificationChange={handleNotificationChange}
      />
    </div>
  )
}
