import {
  NotificationsSettings as NotificationsSettingsPanel,
  type NotificationSettings,
} from '../../features/settings'
import { useSettingsStore, toast } from '../../stores'

export function NotificationsSettings() {
  const notifications = useSettingsStore((state) => state.notifications)
  const updateNotifications = useSettingsStore((state) => state.updateNotifications)

  const handleNotificationChange = (
    key: keyof NotificationSettings,
    value: boolean | number
  ) => {
    updateNotifications({ [key]: value })
    toast.success('Notification settings updated')
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
