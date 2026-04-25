<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Book;
use App\Models\MeetingRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class StatsController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'totalUsers' => User::query()->count(),
            'totalBooks' => Book::query()->count(),
            'totalRequests' => MeetingRequest::query()->count(),
            'pendingRequests' => MeetingRequest::query()->where('status', 'pending')->count(),
            'latestLogs' => AuditLog::query()->orderByDesc('createdAt')->limit(10)->get(),
        ]);
    }
}
