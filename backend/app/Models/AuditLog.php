<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class AuditLog extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'audit_logs';

    protected $fillable = [
        'actorId',
        'action',
        'meta',
        'createdAt',
    ];

    protected $casts = [
        'meta' => 'array',
        'createdAt' => 'datetime',
    ];
}
