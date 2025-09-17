import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Shield, Users, BarChart3, ArrowRight, CheckCircle } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Navigation */}
      <nav className="container mx-auto flex items-center justify-between py-6">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-secondary-900">WolvCapital</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/auth/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/auth/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-secondary-900 mb-6">
          Invest Smarter with{' '}
          <span className="text-primary-600">WolvCapital</span>
        </h1>
        <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
          Build your wealth with our comprehensive investment platform. Access professional-grade 
          investment plans with realistic daily returns and expert portfolio management.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/auth/signup">
            <Button size="lg" className="min-w-[200px]">
              Start Investing Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline" size="lg" className="min-w-[200px]">
              Access Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            Why Choose WolvCapital?
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Our platform combines cutting-edge technology with proven investment strategies 
            to deliver exceptional results for our clients.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary-600" />
              </div>
              <CardTitle className="text-lg">High Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Access investment plans with competitive annual returns ranging from 6.5% to 25%, 
                calculated with realistic daily ROI metrics.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto h-12 w-12 bg-success-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-success-600" />
              </div>
              <CardTitle className="text-lg">Secure Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Bank-level security with encrypted transactions, two-factor authentication, 
                and comprehensive audit trails for all activities.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto h-12 w-12 bg-warning-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-warning-600" />
              </div>
              <CardTitle className="text-lg">Expert Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Professional portfolio managers with decades of experience oversee all 
                investment strategies and risk management protocols.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto h-12 w-12 bg-danger-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-danger-600" />
              </div>
              <CardTitle className="text-lg">Real-time Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitor your portfolio performance with advanced analytics, real-time updates, 
                and comprehensive reporting tools.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Investment Plans Preview */}
      <section className="container mx-auto px-4 py-20 bg-white/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            Investment Plans
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Choose from our carefully curated investment plans designed to match your risk tolerance and financial goals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="border-2 hover:border-primary-300 transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-success-600">Conservative Growth</CardTitle>
                  <CardDescription className="mt-2">Low risk, steady returns</CardDescription>
                </div>
                <span className="status-badge risk-low">Low Risk</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary-900 mb-2">6.5%</div>
              <div className="text-sm text-secondary-600 mb-4">Expected Annual Return</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-success-500 mr-2" />
                  Minimum investment: $1,000
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-success-500 mr-2" />
                  Diversified portfolio
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-success-500 mr-2" />
                  Professional management
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary-300 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-primary-600">Balanced Growth</CardTitle>
                  <CardDescription className="mt-2">Moderate risk, balanced returns</CardDescription>
                </div>
                <span className="status-badge risk-medium">Medium Risk</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary-900 mb-2">12.0%</div>
              <div className="text-sm text-secondary-600 mb-4">Expected Annual Return</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-success-500 mr-2" />
                  Minimum investment: $2,500
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-success-500 mr-2" />
                  Mixed asset allocation
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-success-500 mr-2" />
                  Advanced analytics
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary-300 transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-danger-600">Growth Aggressive</CardTitle>
                  <CardDescription className="mt-2">High risk, high potential returns</CardDescription>
                </div>
                <span className="status-badge risk-high">High Risk</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary-900 mb-2">25.0%</div>
              <div className="text-sm text-secondary-600 mb-4">Expected Annual Return</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-success-500 mr-2" />
                  Minimum investment: $500
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-success-500 mr-2" />
                  Cryptocurrency focus
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-success-500 mr-2" />
                  Premium support
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Link href="/auth/signup">
            <Button size="lg">
              View All Investment Plans
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
          Ready to Start Your Investment Journey?
        </h2>
        <p className="text-lg text-secondary-600 mb-8 max-w-2xl mx-auto">
          Join thousands of investors who trust WolvCapital with their financial future. 
          Get started today with our user-friendly platform and expert guidance.
        </p>
        <Link href="/auth/signup">
          <Button size="lg" className="min-w-[250px]">
            Create Your Account
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">WolvCapital</span>
              </div>
              <p className="text-secondary-400">
                Building the future of smart investing with cutting-edge technology and proven strategies.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-secondary-400">
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/investments" className="hover:text-white transition-colors">Investment Plans</Link></li>
                <li><Link href="/portfolio" className="hover:text-white transition-colors">Portfolio</Link></li>
                <li><Link href="/analytics" className="hover:text-white transition-colors">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-secondary-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
                <li><Link href="/compliance" className="hover:text-white transition-colors">Compliance</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-secondary-400">
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/risk" className="hover:text-white transition-colors">Risk Disclosure</Link></li>
                <li><Link href="/licensing" className="hover:text-white transition-colors">Licensing</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-secondary-800 mt-8 pt-8 text-center text-secondary-400">
            <p>&copy; 2024 WolvCapital. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}