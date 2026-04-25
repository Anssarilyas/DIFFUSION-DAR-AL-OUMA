<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\AuditLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class UserManagementController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'users' => User::query()->orderByDesc('createdAt')->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:120'],
            'lastname' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:160', 'unique:users,email'],
            'phone' => ['required', 'string', 'max:30', 'unique:users,phone'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'in:admin,formateur,utilisateur'],
            'subject' => ['nullable', 'string', 'max:100'],
            'level' => ['nullable', 'string', 'max:100'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $payload = $validator->validated();

        $user = User::query()->create([
            'name' => $payload['name'],
            'lastname' => $payload['lastname'],
            'email' => strtolower($payload['email']),
            'phone' => $payload['phone'],
            'passwordHash' => Hash::make($payload['password']),
            'role' => $payload['role'],
            'subject' => $payload['subject'] ?? null,
            'level' => $payload['level'] ?? null,
            'createdAt' => now(),
        ]);

        AuditLogger::record($request->user(), 'users.created', [
            'userId' => (string) $user->getKey(),
            'role' => $user->role,
        ]);

        return response()->json([
            'message' => 'User created.',
            'user' => $user,
        ], Response::HTTP_CREATED);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $user = User::query()->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => ['sometimes', 'string', 'max:120'],
            'lastname' => ['sometimes', 'string', 'max:120'],
            'phone' => ['sometimes', 'string', 'max:30'],
            'role' => ['sometimes', 'in:admin,formateur,utilisateur'],
            'subject' => ['nullable', 'string', 'max:100'],
            'level' => ['nullable', 'string', 'max:100'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $payload = $validator->validated();

        if (isset($payload['password'])) {
            $payload['passwordHash'] = Hash::make($payload['password']);
            unset($payload['password']);
        }

        $user->fill($payload);
        $user->save();

        AuditLogger::record($request->user(), 'users.updated', [
            'userId' => $id,
        ]);

        return response()->json([
            'message' => 'User updated.',
            'user' => $user,
        ]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $user = User::query()->findOrFail($id);
        $user->delete();

        AuditLogger::record($request->user(), 'users.deleted', [
            'userId' => $id,
        ]);

        return response()->json([
            'message' => 'User deleted.',
        ]);
    }
}
