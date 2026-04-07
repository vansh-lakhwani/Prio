'use client'

import { Check, X, AlertCircle } from 'lucide-react'

export function DatabaseTests({ profile, tasks }: any) {
  const tests = [
    {
      name: 'Profile Read',
      status: profile ? 'pass' : 'fail',
      detail: profile ? `Loaded profile for ${profile.email}` : 'Failed to load profile',
    },
    {
      name: 'Tasks Read',
      status: tasks ? 'pass' : 'fail',
      detail: tasks ? `Loaded ${tasks?.length || 0} tasks` : 'Failed to load tasks',
    },
    {
      name: 'Profile Table Structure',
      status: profile?.id && profile?.email ? 'pass' : 'fail',
      detail: 'Required columns present',
    },
    {
      name: 'Tasks Table Structure',
      status: tasks?.[0]?.id && tasks?.[0]?.user_id ? 'pass' : tasks?.length === 0 ? 'pass' : 'fail',
      detail: tasks?.length > 0 ? 'Required columns present' : 'No tasks to verify structure',
    },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">💾 Database Tests</h2>
      
      <div className="space-y-3">
        {tests.map((test, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 flex items-start gap-3 ${
              test.status === 'pass'
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            {test.status === 'pass' ? (
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{test.name}</h4>
              <p className="text-sm text-gray-600">{test.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Data Summary */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">📊 Data Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-700">Profile ID:</span>
            <p className="font-mono text-xs text-gray-600 break-all">{profile?.id || 'N/A'}</p>
          </div>
          <div>
            <span className="text-blue-700">Total Tasks:</span>
            <p className="font-semibold text-gray-900">{tasks?.length || 0}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
