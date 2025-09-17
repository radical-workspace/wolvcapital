'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Settings,
  BarChart3,
  UserCheck
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'

interface StatsCardProps {
  title: string
  value: string
  change?: string
  icon: React.ReactNode
  color?: string
}

function StatsCard({ title, value, change, icon, color = 'blue' }: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600'
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
            {change && (
              <p className="text-sm text-gray-500 mt-1">{change}</p>
            )}
          </div>
          <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${colorClasses[color as keyof typeof colorClasses]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ApprovalRequest {
  id: string
  type: string
  user: string
  amount?: number
  description: string
  date: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'under_review' | 'approved' | 'rejected'
}

function PendingApprovals() {
  const [approvals] = useState<ApprovalRequest[]>([
    {
      id: '1',
      type: 'Large Investment',
      user: 'John Doe',
      amount: 50000,
      description: 'Investment in Crypto Portfolio exceeds approval threshold',
      date: '2024-09-17',
      priority: 'high',
      status: 'pending'
    },
    {
      id: '2',
      type: 'KYC Verification',
      user: 'Jane Smith',
      description: 'Document verification for new account',
      date: '2024-09-16',
      priority: 'medium',
      status: 'under_review'
    },
    {
      id: '3',
      type: 'Withdrawal Request',
      user: 'Bob Johnson',
      amount: 25000,
      description: 'Large withdrawal request requiring approval',
      date: '2024-09-15',
      priority: 'critical',
      status: 'pending'
    }
  ])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'under_review': return <AlertTriangle className="h-4 w-4 text-blue-600" />
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />
      default: return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Requests requiring admin attention</CardDescription>
          </div>
          <Button size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {approvals.map((approval) => (
            <div key={approval.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(approval.status)}
                  <h3 className="font-medium text-gray-900">{approval.type}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(approval.priority)}`}>
                    {approval.priority.toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-gray-500">{formatDate(approval.date)}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{approval.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-medium">User:</span> {approval.user}
                  {approval.amount && (
                    <span className="ml-4">
                      <span className="font-medium">Amount:</span> {formatCurrency(approval.amount)}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                  <Button size="sm">
                    Approve
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function RecentActivity() {
  const activities = [
    { id: '1', action: 'User Registration', user: 'Alice Cooper', time: '2 hours ago', status: 'success' },
    { id: '2', action: 'Large Investment', user: 'David Wilson', time: '4 hours ago', status: 'pending' },
    { id: '3', action: 'KYC Approved', user: 'Emma Davis', time: '6 hours ago', status: 'success' },
    { id: '4', action: 'Withdrawal Processed', user: 'Michael Brown', time: '8 hours ago', status: 'success' },
    { id: '5', action: 'Document Rejected', user: 'Sarah Miller', time: '1 day ago', status: 'error' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600'
      case 'pending': return 'text-yellow-600'
      case 'error': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform activities</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">by {activity.user}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${getStatusColor(activity.status)}`}>
                  {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                </p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth()

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">WolvCapital Admin</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                User Dashboard
              </Button>
            </Link>
            <div className="text-sm text-gray-600">
              Welcome, {user?.email}
            </div>
          </div>
        </div>
      </nav>

      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage users, approvals, and platform operations
          </p>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Users"
            value="1,247"
            change="+12% from last month"
            icon={<Users className="h-6 w-6" />}
            color="blue"
          />
          <StatsCard
            title="Total Assets"
            value={formatCurrency(45230000)}
            change="+8.5% from last month"
            icon={<DollarSign className="h-6 w-6" />}
            color="green"
          />
          <StatsCard
            title="Pending Approvals"
            value="23"
            change="3 critical priority"
            icon={<AlertTriangle className="h-6 w-6" />}
            color="yellow"
          />
          <StatsCard
            title="Active Investments"
            value="8,945"
            change="+156 this week"
            icon={<TrendingUp className="h-6 w-6" />}
            color="blue"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PendingApprovals />
          <RecentActivity />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
            <CardDescription>Frequently used admin functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="justify-start h-auto p-4 flex-col items-start space-y-2">
                <UserCheck className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">User Management</div>
                  <div className="text-xs opacity-70">Manage user accounts</div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4 flex-col items-start space-y-2">
                <TrendingUp className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Investment Plans</div>
                  <div className="text-xs opacity-70">Create and manage plans</div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4 flex-col items-start space-y-2">
                <BarChart3 className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Analytics</div>
                  <div className="text-xs opacity-70">Platform insights</div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4 flex-col items-start space-y-2">
                <Settings className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Settings</div>
                  <div className="text-xs opacity-70">Platform configuration</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}