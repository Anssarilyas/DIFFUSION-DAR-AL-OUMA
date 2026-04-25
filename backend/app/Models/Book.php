<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Book extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'books';

    protected $fillable = [
        'title',
        'description',
        'imageUrl',
        'pdfUrl',
        'subject',
        'level',
        'createdBy',
        'createdAt',
    ];

    protected $casts = [
        'createdAt' => 'datetime',
    ];
}
