'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Plus
} from 'lucide-react'
import { formatCurrency, formatPercentage, generateRandomROI } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: React.ReactNode
}

function StatsCard({ title, value, change, changeType, icon }: StatsCardProps) {
  const changeColor = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  }[changeType]

  const ChangeIcon = changeType === 'positive' ? ArrowUpRight : ArrowDownRight

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
            <div className={`flex items-center mt-2 text-sm ${changeColor}`}>
              <ChangeIcon className="h-3 w-3 mr-1" />
              <span>{change}</span>
            </div>
          </div>
          <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface Investment {
  id: string
  name: string
  type: string
  amount: number
  currentValue: number
  dailyChange: number
  risk: 'low' | 'medium' | 'high'
}

function PortfolioOverview() {
  const [investments] = useState<Investment[]>([
    {
      id: '1',
      name: 'Conservative Growth Fund',
      type: 'Mixed Portfolio',
      amount: 5000,
      currentValue: 5325,
      dailyChange: 0.65,
      risk: 'low'
    },
    {
      id: '2',
      name: 'Balanced Growth',
      type: 'Stocks & Bonds',
      amount: 10000,
      currentValue: 10840,
      dailyChange: -0.23,
      risk: 'medium'
    },
    {
      id: '3',
      name: 'Crypto Portfolio',
      type: 'Cryptocurrency',
      amount: 2500,
      currentValue: 2890,
      dailyChange: 2.1,
      risk: 'high'
    }
  ])

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Portfolio Overview</CardTitle>
            <CardDescription>Your active investments</CardDescription>
          </div>
          <Button size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {investments.map((investment) => (
            <div key={investment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{investment.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskBadgeColor(investment.risk)}`}>
                    {investment.risk.toUpperCase()} RISK
                  </span>
                </div>
                <p className="text-sm text-gray-600">{investment.type}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-medium">
                    {formatCurrency(investment.currentValue)}
                  </span>
                  <span className={`text-sm ${investment.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {investment.dailyChange >= 0 ? '+' : ''}{formatPercentage(investment.dailyChange)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function RecentTransactions() {
  const transactions = [
    { id: '1', type: 'Investment', description: 'Conservative Growth Fund', amount: 5000, date: '2024-09-15', status: 'completed' },
    { id: '2', type: 'Dividend', description: 'Balanced Growth', amount: 45.20, date: '2024-09-14', status: 'completed' },
    { id: '3', type: 'Investment', description: 'Crypto Portfolio', amount: 2500, date: '2024-09-13', status: 'pending' },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest activity in your account</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`h-2 w-2 rounded-full ${
                  transaction.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                }`} />
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-600">{transaction.type} • {transaction.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  {transaction.type === 'Dividend' ? '+' : ''}{formatCurrency(transaction.amount)}
                </p>
                <p className={`text-sm ${
                  transaction.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {transaction.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const [dailyROI, setDailyROI] = useState(0)

  // Simulate real-time ROI updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDailyROI(generateRandomROI(12, 0.05)) // 12% annual base, 5% volatility
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  // Calculate summary statistics
  const totalInvested = 17500
  const currentValue = 19055
  const totalGains = currentValue - totalInvested
  const returnPercentage = (totalGains / totalInvested) * 100

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {profile?.full_name || user?.email?.split('@')[0]}
          </h1>
          <p className="text-gray-600">
            Here's an overview of your investment portfolio
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Portfolio Value"
            value={formatCurrency(currentValue)}
            change={`${formatPercentage(returnPercentage)} overall`}
            changeType="positive"
            icon={<DollarSign className="h-6 w-6 text-blue-600" />}
          />
          <StatsCard
            title="Total Invested"
            value={formatCurrency(totalInvested)}
            change="3 active investments"
            changeType="neutral"
            icon={<TrendingUp className="h-6 w-6 text-blue-600" />}
          />
          <StatsCard
            title="Total Gains"
            value={formatCurrency(totalGains)}
            change={`${formatPercentage(returnPercentage)} return`}
            changeType="positive"
            icon={<ArrowUpRight className="h-6 w-6 text-blue-600" />}
          />
          <StatsCard
            title="Daily ROI"
            value={formatPercentage(dailyROI * 100)}
            change="Live update"
            changeType={dailyROI >= 0 ? 'positive' : 'negative'}
            icon={<PieChart className="h-6 w-6 text-blue-600" />}
          />
        </div>

        {/* Charts and Portfolio */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PortfolioOverview />
          <RecentTransactions />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your investments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button className="justify-start h-auto p-4 flex-col items-start space-y-2">
                <Plus className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">New Investment</div>
                  <div className="text-xs opacity-70">Browse investment plans</div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4 flex-col items-start space-y-2">
                <TrendingUp className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Portfolio Analysis</div>
                  <div className="text-xs opacity-70">View detailed analytics</div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4 flex-col items-start space-y-2">
                <DollarSign className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Withdraw Funds</div>
                  <div className="text-xs opacity-70">Request withdrawal</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}