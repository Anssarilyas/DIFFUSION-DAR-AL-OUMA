<?php

use App\Http\Controllers\Api\Admin\CatalogOptionController;
use App\Http\Controllers\Api\Admin\MeetingRequestAdminController;
use App\Http\Controllers\Api\Admin\StatsController;
use App\Http\Controllers\Api\Admin\UserManagementController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\Formateur\BookController as FormateurBookController;
use App\Http\Controllers\Api\Formateur\RequestController as FormateurRequestController;
use App\Http\Controllers\Api\MeetingRequestController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/books', [BookController::class, 'index']);
Route::get('/books/{id}', [BookController::class, 'show']);

Route::middleware('auth:api')->group(function (): void {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/meeting-requests', [MeetingRequestController::class, 'store'])->middleware('role:utilisateur');
    Route::get('/meeting-requests/mine', [MeetingRequestController::class, 'mine'])->middleware('role:utilisateur');

    Route::prefix('admin')->middleware('role:admin')->group(function (): void {
        Route::post('/books', [BookController::class, 'store']);
        Route::put('/books/{id}', [BookController::class, 'update']);
        Route::delete('/books/{id}', [BookController::class, 'destroy']);

        Route::get('/meeting-requests', [MeetingRequestAdminController::class, 'index']);
        Route::patch('/meeting-requests/{id}/confirm', [MeetingRequestAdminController::class, 'confirm']);
        Route::patch('/meeting-requests/{id}/refuse', [MeetingRequestAdminController::class, 'refuse']);

        Route::get('/users', [UserManagementController::class, 'index']);
        Route::post('/users', [UserManagementController::class, 'store']);
        Route::patch('/users/{id}', [UserManagementController::class, 'update']);
        Route::delete('/users/{id}', [UserManagementController::class, 'destroy']);

        Route::get('/stats', [StatsController::class, 'index']);

        Route::get('/catalog-options', [CatalogOptionController::class, 'index']);
        Route::post('/catalog-options', [CatalogOptionController::class, 'store']);
        Route::delete('/catalog-options/{id}', [CatalogOptionController::class, 'destroy']);
    });

    Route::prefix('formateur')->middleware('role:formateur')->group(function (): void {
        Route::get('/books', [FormateurBookController::class, 'index']);
        Route::get('/requests', [FormateurRequestController::class, 'index']);
    });
});
