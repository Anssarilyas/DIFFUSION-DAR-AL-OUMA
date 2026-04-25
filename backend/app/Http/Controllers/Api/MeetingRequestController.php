<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\MeetingRequest;
use App\Support\AuditLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MeetingRequestController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'bookId' => ['required', 'string'],
            'message' => ['required', 'string', 'max:1000'],
        ]);

        $book = Book::query()->findOrFail($payload['bookId']);

        $meetingRequest = MeetingRequest::query()->create([
            'userId' => $request->user()->getAuthIdentifier(),
            'bookId' => $payload['bookId'],
            'subject' => $book->subject,
            'message' => $payload['message'],
            'status' => 'pending',
            'createdAt' => now(),
        ]);

        AuditLogger::record($request->user(), 'meeting-requests.created', [
            'requestId' => (string) $meetingRequest->getKey(),
            'bookId' => $payload['bookId'],
        ]);

        return response()->json([
            'message' => 'Meeting request submitted.',
            'request' => $meetingRequest,
        ], Response::HTTP_CREATED);
    }

    public function mine(Request $request): JsonResponse
    {
        $requests = MeetingRequest::query()
            ->where('userId', $request->user()->getAuthIdentifier())
            ->orderByDesc('createdAt')
            ->get();

        return response()->json([
            'requests' => $requests,
        ]);
    }
}
