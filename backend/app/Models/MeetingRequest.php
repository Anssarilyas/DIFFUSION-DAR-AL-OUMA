<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class MeetingRequest extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'meeting_requests';

    protected $fillable = [
        'userId',
        'bookId',
        'subject',
        'message',
        'status',
        'meetingRoomId',
        'meetingTitle',
        'meetingStartsAt',
        'meetingDurationMinutes',
        'meetingHostId',
        'meetingLinkPath',
        'meetingProvider',
        'createdAt',
    ];

    protected $casts = [
        'createdAt' => 'datetime',
        'meetingStartsAt' => 'datetime',
    ];
}
