import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function calculateROI(initial: number, current: number): number {
  if (initial === 0) return 0
  return ((current - initial) / initial) * 100
}

export function calculateDailyROI(annualROI: number): number {
  return Math.pow(1 + annualROI / 100, 1 / 365) - 1
}

export function generateRandomROI(baseROI: number, volatility: number = 0.1): number {
  // Generate realistic daily ROI with some volatility
  const randomFactor = (Math.random() - 0.5) * 2 * volatility
  const dailyROI = calculateDailyROI(baseROI)
  return dailyROI * (1 + randomFactor)
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    // Transaction statuses
    pending: 'bg-warning-100 text-warning-800',
    processing: 'bg-primary-100 text-primary-800',
    completed: 'bg-success-100 text-success-800',
    failed: 'bg-danger-100 text-danger-800',
    cancelled: 'bg-secondary-100 text-secondary-800',
    
    // Account statuses
    active: 'bg-success-100 text-success-800',
    suspended: 'bg-warning-100 text-warning-800',
    closed: 'bg-danger-100 text-danger-800',
    
    // KYC statuses
    approved: 'bg-success-100 text-success-800',
    rejected: 'bg-danger-100 text-danger-800',
    in_review: 'bg-primary-100 text-primary-800',
    
    // Risk levels
    low: 'bg-success-100 text-success-800',
    medium: 'bg-warning-100 text-warning-800',
    high: 'bg-danger-100 text-danger-800',
    
    // Priority levels
    critical: 'bg-danger-100 text-danger-800',
    high: 'bg-warning-100 text-warning-800',
    
    // Default
    default: 'bg-secondary-100 text-secondary-800',
  }
  
  return statusColors[status] || statusColors.default
}

export function getRiskColor(risk: string): string {
  const riskColors: Record<string, string> = {
    low: 'text-success-600',
    medium: 'text-warning-600',
    high: 'text-danger-600',
  }
  return riskColors[risk] || riskColors.medium
}

export function truncateText(text: string, length: number = 100): string {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  return {
    valid: errors.length === 0,
    errors,
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}