
'use client';
import { useState, useEffect } from 'react';
import { apiRequest } from './src/lib/api';
import { AdminApproval } from './src/types/laravel';

export default function AdminApprovalsPage() {
  const [approvals, setApprovals] = useState<AdminApproval[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  apiRequest('/approvals').then((res: { data: AdminApproval[] }) => setApprovals(res.data)).finally(() => setLoading(false));
  }, []);

  const handleReview = async (id: string, status: 'approved' | 'rejected') => {
    await apiRequest(`/approvals/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
      headers: { 'Content-Type': 'application/json' }
    });
  setApprovals(approvals.map(a => a.id === id ? { ...a, status } : a));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Admin Approvals</h2>
      <ul>
        {approvals.map(a => (
          <li key={a.id}>
            <strong>{a.approval_type}</strong> - {a.status}
            <button onClick={() => handleReview(a.id, 'approved')}>Approve</button>
            <button onClick={() => handleReview(a.id, 'rejected')}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
}