<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\MeetingRequest;
use App\Support\AuditLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MeetingRequestAdminController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'requests' => MeetingRequest::query()->orderByDesc('createdAt')->get(),
        ]);
    }

    public function confirm(Request $request, string $id): JsonResponse
    {
        return $this->updateStatus($request, $id, 'confirmed');
    }

    public function refuse(Request $request, string $id): JsonResponse
    {
        return $this->updateStatus($request, $id, 'refused');
    }

    private function updateStatus(Request $request, string $id, string $status): JsonResponse
    {
        $meetingRequest = MeetingRequest::query()->findOrFail($id);
        $meetingRequest->status = $status;

        if ($status === 'confirmed') {
            $meetingRequest->meetingRoomId = $meetingRequest->meetingRoomId ?: 'room-' . Str::lower(Str::random(10));
            $meetingRequest->meetingTitle = $meetingRequest->meetingTitle ?: "Réunion {$meetingRequest->subject}";
            $meetingRequest->meetingStartsAt = $meetingRequest->meetingStartsAt ?: now()->addMinutes(30);
            $meetingRequest->meetingDurationMinutes = $meetingRequest->meetingDurationMinutes ?: 30;
            $meetingRequest->meetingHostId = $meetingRequest->meetingHostId ?: optional($request->user())->id;
            $meetingRequest->meetingLinkPath = $meetingRequest->meetingLinkPath ?: "/meeting-room/{$meetingRequest->getKey()}";
            $meetingRequest->meetingProvider = 'internal';
        } else {
            $meetingRequest->meetingRoomId = null;
            $meetingRequest->meetingTitle = null;
            $meetingRequest->meetingStartsAt = null;
            $meetingRequest->meetingDurationMinutes = null;
            $meetingRequest->meetingHostId = null;
            $meetingRequest->meetingLinkPath = null;
            $meetingRequest->meetingProvider = null;
        }

        $meetingRequest->save();

        AuditLogger::record($request->user(), "meeting-requests.{$status}", [
            'requestId' => $id,
        ]);

        return response()->json([
            'message' => 'Request status updated.',
            'request' => $meetingRequest,
        ]);
    }
}
