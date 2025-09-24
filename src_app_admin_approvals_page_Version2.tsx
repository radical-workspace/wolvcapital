'use client';
import { useState, useEffect } from 'react';
import { laravelApi } from '../../../lib/laravel-api';
import { AdminApproval } from '../../../types/laravel';

export default function AdminApprovalsPage() {
  const [approvals, setApprovals] = useState<AdminApproval[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    laravelApi.get('/approvals').then(res => setApprovals(res.data)).finally(() => setLoading(false));
  }, []);

  const handleReview = async (id: number, status: 'approved' | 'rejected') => {
    await laravelApi.put(`/approvals/${id}`, { status });
    setApprovals(approvals.map(a => a.id === id ? { ...a, status } : a));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Admin Approvals</h2>
      <ul>
        {approvals.map(a => (
          <li key={a.id}>
            <strong>{a.type}</strong> - {a.status}
            <button onClick={() => handleReview(a.id, 'approved')}>Approve</button>
            <button onClick={() => handleReview(a.id, 'rejected')}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
}