<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class CatalogOption extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'catalog_options';

    protected $fillable = [
        'type',
        'name',
        'createdAt',
    ];

    protected $casts = [
        'createdAt' => 'datetime',
    ];
}
