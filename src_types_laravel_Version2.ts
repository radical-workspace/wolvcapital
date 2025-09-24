export type User = {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  kyc_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
};

export type AdminApproval = {
  id: number;
  user_id: number;
  type: 'kyc' | 'large_investment' | 'withdrawal' | 'other';
  data: any;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: number;
  reviewed_at?: string;
  comment?: string;
  created_at: string;
  updated_at: string;
};