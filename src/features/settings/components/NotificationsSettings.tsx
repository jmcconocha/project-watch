import { Bell, BellOff } from 'lucide-react'
import type { NotificationSettings } from '../types'

interface NotificationsSettingsProps {
  notifications: NotificationSettings
  onNotificationChange?: (key: keyof NotificationSettings, value: boolean | number) => void
}

function Toggle({
  enabled,
  onChange,
  disabled,
}: {
  enabled: boolean
  onChange: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`
        relative w-11 h-6 rounded-full transition-colors duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${enabled ? 'bg-cyan-500' : 'bg-slate-200 dark:bg-slate-700'}
      `}
    >
      <span
        className={`
          absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white
          transition-transform duration-200 shadow-sm
          ${enabled ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  )
}

function NotificationToggle({
  label,
  description,
  enabled,
  onChange,
  disabled,
}: {
  label: string
  description: string
  enabled: boolean
  onChange: () => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-start gap-4 py-3">
      <div className="flex-1">
        <p
          className={`font-medium ${
            disabled
              ? 'text-slate-400 dark:text-slate-600'
              : 'text-slate-900 dark:text-slate-100'
          }`}
        >
          {label}
        </p>
        <p
          className={`text-sm mt-0.5 ${
            disabled
              ? 'text-slate-400 dark:text-slate-600'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {description}
        </p>
      </div>
      <Toggle enabled={enabled} onChange={onChange} disabled={disabled} />
    </div>
  )
}

export function NotificationsSettings({
  notifications,
  onNotificationChange,
}: NotificationsSettingsProps) {
  const notificationsDisabled = !notifications.enabled

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Notifications
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Control when and how Project Watch notifies you about important updates.
        </p>
      </div>

      {/* Master Toggle */}
      <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
        <div
          className={`p-2 rounded-lg ${
            notifications.enabled
              ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
          }`}
        >
          {notifications.enabled ? (
            <Bell className="h-5 w-5" />
          ) : (
            <BellOff className="h-5 w-5" />
          )}
        </div>
        <div className="flex-1">
          <p className="font-medium text-slate-900 dark:text-slate-100">
            Enable Notifications
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {notifications.enabled
              ? 'Notifications are enabled'
              : 'All notifications are currently disabled'}
          </p>
        </div>
        <Toggle
          enabled={notifications.enabled}
          onChange={() => onNotificationChange?.('enabled', !notifications.enabled)}
        />
      </div>

      {/* Git Notifications */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 pb-2">
          Git Status
        </h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          <NotificationToggle
            label="Git status changes"
            description="Notify when projects have new commits, branches, or uncommitted changes"
            enabled={notifications.gitStatusChanges}
            onChange={() =>
              onNotificationChange?.('gitStatusChanges', !notifications.gitStatusChanges)
            }
            disabled={notificationsDisabled}
          />
          <NotificationToggle
            label="Uncommitted changes reminder"
            description="Remind you when projects have uncommitted changes for too long"
            enabled={notifications.uncommittedReminders}
            onChange={() =>
              onNotificationChange?.('uncommittedReminders', !notifications.uncommittedReminders)
            }
            disabled={notificationsDisabled}
          />
        </div>

        {/* Reminder Hours Selector */}
        {notifications.uncommittedReminders && !notificationsDisabled && (
          <div className="pt-2 pl-4">
            <label
              htmlFor="reminder-hours"
              className="block text-sm text-slate-600 dark:text-slate-400 mb-2"
            >
              Remind after
            </label>
            <select
              id="reminder-hours"
              value={notifications.uncommittedReminderHours}
              onChange={(e) =>
                onNotificationChange?.('uncommittedReminderHours', Number(e.target.value))
              }
              className="px-3 py-2 rounded-lg text-sm
                         bg-white dark:bg-slate-800
                         border border-slate-200 dark:border-slate-700
                         text-slate-900 dark:text-slate-100
                         focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                         transition-colors"
            >
              <option value={12}>12 hours</option>
              <option value={24}>24 hours</option>
              <option value={48}>48 hours</option>
              <option value={72}>72 hours</option>
            </select>
          </div>
        )}
      </div>

      {/* GitHub Notifications */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 pb-2">
          GitHub
        </h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          <NotificationToggle
            label="Pull request updates"
            description="Notify when your PRs are merged, closed, or have new comments"
            enabled={notifications.prUpdates}
            onChange={() => onNotificationChange?.('prUpdates', !notifications.prUpdates)}
            disabled={notificationsDisabled}
          />
          <NotificationToggle
            label="Review requests"
            description="Notify when you're requested to review a pull request"
            enabled={notifications.prReviewRequests}
            onChange={() =>
              onNotificationChange?.('prReviewRequests', !notifications.prReviewRequests)
            }
            disabled={notificationsDisabled}
          />
          <NotificationToggle
            label="Issue assignments"
            description="Notify when issues are assigned to you"
            enabled={notifications.issueAssignments}
            onChange={() =>
              onNotificationChange?.('issueAssignments', !notifications.issueAssignments)
            }
            disabled={notificationsDisabled}
          />
        </div>
      </div>

      {/* System Notifications */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 pb-2">
          System
        </h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          <NotificationToggle
            label="Sync errors"
            description="Notify when there are errors syncing project data"
            enabled={notifications.syncErrors}
            onChange={() => onNotificationChange?.('syncErrors', !notifications.syncErrors)}
            disabled={notificationsDisabled}
          />
        </div>
      </div>
    </div>
  )
}
