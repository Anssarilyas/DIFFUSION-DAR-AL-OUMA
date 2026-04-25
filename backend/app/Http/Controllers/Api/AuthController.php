<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\AuditLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:120'],
            'lastname' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:160', 'unique:users,email'],
            'phone' => ['required', 'string', 'max:30', 'unique:users,phone'],
            'password' => ['required', 'string', 'min:8'],
            'level' => ['nullable', 'string', 'max:120'],
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
            'role' => 'utilisateur',
            'subject' => null,
            'level' => $payload['level'] ?? null,
            'createdAt' => now(),
        ]);

        $token = JWTAuth::fromUser($user);

        AuditLogger::record($user, 'auth.register', [
            'email' => $user->email,
        ]);

        return response()->json([
            'message' => 'Registration successful.',
            'token' => $token,
            'user' => $user,
        ], Response::HTTP_CREATED);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $token = Auth::attempt([
            'email' => strtolower($credentials['email']),
            'password' => $credentials['password'],
        ]);

        if (! $token) {
            return response()->json([
                'message' => 'Invalid credentials.',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $user = Auth::user();

        AuditLogger::record($user, 'auth.login');

        return response()->json([
            'message' => 'Login successful.',
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        AuditLogger::record($request->user(), 'auth.logout');
        Auth::logout();

        return response()->json([
            'message' => 'Logout successful.',
        ]);
    }
}
