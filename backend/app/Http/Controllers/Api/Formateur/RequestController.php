<?php

namespace App\Http\Controllers\Api\Formateur;

use App\Http\Controllers\Controller;
use App\Models\MeetingRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RequestController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'requests' => MeetingRequest::query()
                ->where('subject', $request->user()->subject)
                ->orderByDesc('createdAt')
                ->get(),
        ]);
    }
}
