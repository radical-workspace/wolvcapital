'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  TrendingUp, 
  Shield, 
  DollarSign, 
  Clock,
  Star,
  Search,
  Filter,
  ChevronDown
} from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/lib/utils'

interface InvestmentPlan {
  id: string
  name: string
  description: string
  shortDescription: string
  minimumInvestment: number
  maximumInvestment: number
  expectedAnnualReturn: number
  riskLevel: 'low' | 'medium' | 'high'
  planType: string
  durationMonths: number
  managementFee: number
  isFeatured: boolean
  currentInvestors: number
  totalCapitalRaised: number
  targetCapital: number
  tags: string[]
}

function InvestmentPlanCard({ plan }: { plan: InvestmentPlan }) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const progress = (plan.totalCapitalRaised / plan.targetCapital) * 100

  return (
    <Card className={`h-full transition-all duration-200 hover:shadow-lg ${plan.isFeatured ? 'border-blue-300 border-2' : ''}`}>
      {plan.isFeatured && (
        <div className="bg-blue-600 text-white text-center py-2 text-sm font-medium rounded-t-lg">
          ⭐ Featured Plan
        </div>
      )}
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{plan.name}</CardTitle>
            <CardDescription className="text-sm">{plan.shortDescription}</CardDescription>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(plan.riskLevel)}`}>
            {plan.riskLevel.toUpperCase()} RISK
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center border-b pb-4">
          <div className="text-3xl font-bold text-blue-600">
            {formatPercentage(plan.expectedAnnualReturn)}
          </div>
          <div className="text-sm text-gray-600">Expected Annual Return</div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Min. Investment:</span>
            <span className="font-medium">{formatCurrency(plan.minimumInvestment)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium">{plan.durationMonths} months</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Management Fee:</span>
            <span className="font-medium">{formatPercentage(plan.managementFee)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Current Investors:</span>
            <span className="font-medium">{plan.currentInvestors.toLocaleString()}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Capital Raised</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {formatCurrency(plan.totalCapitalRaised)} of {formatCurrency(plan.targetCapital)}
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {plan.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag} 
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <Button className="flex-1">
            Invest Now
          </Button>
          <Button variant="outline" size="sm">
            Learn More
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function InvestmentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRisk, setSelectedRisk] = useState('all')
  const [selectedType, setSelectedType] = useState('all')

  const investmentPlans: InvestmentPlan[] = [
    {
      id: '1',
      name: 'Conservative Growth Fund',
      description: 'A low-risk investment plan focused on stable, long-term growth through a diversified portfolio of bonds, dividend-paying stocks, and money market instruments.',
      shortDescription: 'Low-risk diversified portfolio for steady growth',
      minimumInvestment: 1000,
      maximumInvestment: 50000,
      expectedAnnualReturn: 6.5,
      riskLevel: 'low',
      planType: 'Mixed',
      durationMonths: 12,
      managementFee: 1.25,
      isFeatured: false,
      currentInvestors: 1250,
      totalCapitalRaised: 15600000,
      targetCapital: 20000000,
      tags: ['Conservative', 'Stable', 'Long-term']
    },
    {
      id: '2',
      name: 'Balanced Growth',
      description: 'Moderate risk investment with a balanced approach between growth and stability, combining stocks, bonds, and alternative investments.',
      shortDescription: 'Moderate risk, balanced returns',
      minimumInvestment: 2500,
      maximumInvestment: 100000,
      expectedAnnualReturn: 12.0,
      riskLevel: 'medium',
      planType: 'Mixed',
      durationMonths: 18,
      managementFee: 1.75,
      isFeatured: true,
      currentInvestors: 890,
      totalCapitalRaised: 22400000,
      targetCapital: 30000000,
      tags: ['Balanced', 'Growth', 'Diversified']
    },
    {
      id: '3',
      name: 'Cryptocurrency Portfolio',
      description: 'Digital asset investment strategy focusing on established cryptocurrencies and DeFi protocols. High-risk, high-reward investment.',
      shortDescription: 'High risk, high potential returns',
      minimumInvestment: 500,
      maximumInvestment: 50000,
      expectedAnnualReturn: 25.0,
      riskLevel: 'high',
      planType: 'Crypto',
      durationMonths: 12,
      managementFee: 2.50,
      isFeatured: false,
      currentInvestors: 650,
      totalCapitalRaised: 8900000,
      targetCapital: 15000000,
      tags: ['Cryptocurrency', 'Bitcoin', 'DeFi']
    },
    {
      id: '4',
      name: 'Tech Growth Fund',
      description: 'Focus on technology sector stocks with high growth potential, including AI, cloud computing, and emerging tech companies.',
      shortDescription: 'Technology sector focused growth',
      minimumInvestment: 1500,
      maximumInvestment: 75000,
      expectedAnnualReturn: 18.5,
      riskLevel: 'high',
      planType: 'Stocks',
      durationMonths: 24,
      managementFee: 2.00,
      isFeatured: false,
      currentInvestors: 420,
      totalCapitalRaised: 5200000,
      targetCapital: 10000000,
      tags: ['Technology', 'AI', 'Growth']
    },
    {
      id: '5',
      name: 'ESG Sustainable Fund',
      description: 'Environmental, Social, and Governance focused investments in companies with strong sustainability practices.',
      shortDescription: 'Sustainable and responsible investing',
      minimumInvestment: 1000,
      maximumInvestment: 60000,
      expectedAnnualReturn: 9.2,
      riskLevel: 'medium',
      planType: 'ESG',
      durationMonths: 36,
      managementFee: 1.50,
      isFeatured: false,
      currentInvestors: 780,
      totalCapitalRaised: 12300000,
      targetCapital: 18000000,
      tags: ['ESG', 'Sustainable', 'Green']
    },
    {
      id: '6',
      name: 'Real Estate Investment Trust',
      description: 'Investment in commercial and residential real estate properties through REITs and direct property investments.',
      shortDescription: 'Real estate focused portfolio',
      minimumInvestment: 5000,
      maximumInvestment: 200000,
      expectedAnnualReturn: 11.8,
      riskLevel: 'medium',
      planType: 'Real Estate',
      durationMonths: 60,
      managementFee: 1.80,
      isFeatured: true,
      currentInvestors: 320,
      totalCapitalRaised: 45600000,
      targetCapital: 60000000,
      tags: ['Real Estate', 'REITs', 'Property']
    }
  ]

  const filteredPlans = investmentPlans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesRisk = selectedRisk === 'all' || plan.riskLevel === selectedRisk
    const matchesType = selectedType === 'all' || plan.planType.toLowerCase() === selectedType.toLowerCase()
    
    return matchesSearch && matchesRisk && matchesType
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investment Plans</h1>
          <p className="text-gray-600">
            Choose from our carefully curated investment plans designed to match your goals
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search investment plans..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={selectedRisk}
                  onChange={(e) => setSelectedRisk(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="mixed">Mixed</option>
                  <option value="crypto">Crypto</option>
                  <option value="stocks">Stocks</option>
                  <option value="esg">ESG</option>
                  <option value="real estate">Real Estate</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results summary */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Showing {filteredPlans.length} investment plan{filteredPlans.length !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="h-4 w-4" />
            Sort by return (high to low)
          </div>
        </div>

        {/* Investment Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPlans
            .sort((a, b) => b.expectedAnnualReturn - a.expectedAnnualReturn)
            .map((plan) => (
            <InvestmentPlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {filteredPlans.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No plans found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or filters to find investment plans
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedRisk('all')
                  setSelectedType('all')
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}