<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminApproval;
use Illuminate\Http\Request;

class AdminApprovalController extends Controller
{
    public function index(Request $request)
    {
        $approvals = AdminApproval::with('user')->orderByDesc('created_at')->get();
        return response()->json($approvals);
    }

    public function store(Request $request)
    {
        $fields = $request->validate([
            'type' => 'required|string|in:kyc,large_investment,withdrawal,other',
            'data' => 'required|array',
        ]);
        $approval = AdminApproval::create([
            'user_id' => $request->user()->id,
            'type'    => $fields['type'],
            'data'    => json_encode($fields['data']),
            'status'  => 'pending',
        ]);
        return response()->json($approval, 201);
    }

    public function update(Request $request, $id)
    {
        $fields = $request->validate([
            'status'  => 'required|string|in:approved,rejected,pending',
            'comment' => 'nullable|string'
        ]);
        $approval = AdminApproval::findOrFail($id);
        $approval->update([
            'status'      => $fields['status'],
            'comment'     => $fields['comment'],
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);
        return response()->json($approval);
    }
}