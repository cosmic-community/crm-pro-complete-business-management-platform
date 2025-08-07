import { Metadata } from 'next'
import EmployeeList from '@/components/EmployeeList'

export const metadata: Metadata = {
  title: 'Employees - CRM Pro',
  description: 'Manage your employees and staff members',
}

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600 mt-1">Manage your team members and employee information</p>
        </div>
      </div>

      <EmployeeList />
    </div>
  )
}