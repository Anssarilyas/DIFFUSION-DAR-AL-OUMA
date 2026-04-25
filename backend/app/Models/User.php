<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use MongoDB\Laravel\Auth\User as Authenticatable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    protected $connection = 'mongodb';
    protected $collection = 'users';

    protected $fillable = [
        'name',
        'lastname',
        'email',
        'phone',
        'passwordHash',
        'role',
        'subject',
        'level',
        'createdAt',
    ];

    protected $hidden = [
        'passwordHash',
    ];

    protected $casts = [
        'createdAt' => 'datetime',
    ];

    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [
            'role' => $this->role,
            'subject' => $this->subject,
        ];
    }

    public function getAuthPasswordName(): string
    {
        return 'passwordHash';
    }
}
