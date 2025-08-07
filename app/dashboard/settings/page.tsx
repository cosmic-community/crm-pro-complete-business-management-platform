import { Metadata } from 'next'
import SettingsList from '@/components/SettingsList'

export const metadata: Metadata = {
  title: 'Settings - CRM Pro',
  description: 'Manage system settings and configuration',
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Configure system preferences and application settings</p>
        </div>
      </div>

      <SettingsList />
    </div>
  )
}