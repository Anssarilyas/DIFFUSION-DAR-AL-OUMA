<?php

namespace App\Support;

use App\Models\AuditLog;
use Illuminate\Contracts\Auth\Authenticatable;

class AuditLogger
{
    public static function record(?Authenticatable $actor, string $action, array $meta = []): void
    {
        AuditLog::query()->create([
            'actorId' => $actor?->getAuthIdentifier(),
            'action' => $action,
            'meta' => $meta,
            'createdAt' => now(),
        ]);
    }
}
