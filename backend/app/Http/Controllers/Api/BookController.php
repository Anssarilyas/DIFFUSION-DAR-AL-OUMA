<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Support\AuditLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use MongoDB\BSON\Regex;
use Symfony\Component\HttpFoundation\Response;

class BookController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Book::query();

        if ($request->filled('subject')) {
            $query->where('subject', $request->string('subject')->toString());
        }

        if ($request->filled('level')) {
            $query->where('level', $request->string('level')->toString());
        }

        if ($request->filled('search')) {
            $regex = new Regex(preg_quote($request->string('search')->toString()), 'i');

            $query->where(function ($builder) use ($regex): void {
                $builder->where('title', 'regexp', $regex)
                    ->orWhere('description', 'regexp', $regex)
                    ->orWhere('subject', 'regexp', $regex)
                    ->orWhere('level', 'regexp', $regex);
            });
        }

        return response()->json([
            'books' => $query->orderByDesc('createdAt')->get(),
        ]);
    }

    public function show(string $id): JsonResponse
    {
        return response()->json([
            'book' => Book::query()->findOrFail($id),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => ['required', 'string', 'max:160'],
            'description' => ['required', 'string', 'max:2000'],
            'imageUrl' => ['nullable', 'string'],
            'coverImage' => ['required_without:imageUrl', 'image', 'max:5120'],
            'pdfUrl' => ['nullable', 'url'],
            'subject' => ['required', 'string', 'max:100'],
            'level' => ['required', 'string', 'max:100'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $payload = $validator->validated();
        $payload['imageUrl'] = $this->resolveImageUrl($request, $payload);
        unset($payload['coverImage']);

        $book = Book::query()->create([
            ...$payload,
            'createdBy' => $request->user()->getAuthIdentifier(),
            'createdAt' => now(),
        ]);

        AuditLogger::record($request->user(), 'books.created', [
            'bookId' => (string) $book->getKey(),
        ]);

        return response()->json([
            'message' => 'Book created.',
            'book' => $book,
        ], Response::HTTP_CREATED);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $book = Book::query()->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => ['sometimes', 'string', 'max:160'],
            'description' => ['sometimes', 'string', 'max:2000'],
            'imageUrl' => ['nullable', 'string'],
            'coverImage' => ['sometimes', 'image', 'max:5120'],
            'pdfUrl' => ['nullable', 'url'],
            'subject' => ['sometimes', 'string', 'max:100'],
            'level' => ['sometimes', 'string', 'max:100'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $payload = $validator->validated();

        if ($request->hasFile('coverImage') || array_key_exists('imageUrl', $payload)) {
            $payload['imageUrl'] = $this->resolveImageUrl($request, $payload, $book->imageUrl);
        }

        unset($payload['coverImage']);

        $book->fill($payload);
        $book->save();

        AuditLogger::record($request->user(), 'books.updated', [
            'bookId' => $id,
        ]);

        return response()->json([
            'message' => 'Book updated.',
            'book' => $book,
        ]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $book = Book::query()->findOrFail($id);
        $book->delete();

        AuditLogger::record($request->user(), 'books.deleted', [
            'bookId' => $id,
        ]);

        return response()->json([
            'message' => 'Book deleted.',
        ]);
    }

    private function resolveImageUrl(Request $request, array $payload, ?string $currentImageUrl = null): string
    {
        if ($request->hasFile('coverImage')) {
            $path = $request->file('coverImage')->store('books', 'public');

            if ($currentImageUrl && str_contains($currentImageUrl, '/storage/books/')) {
                $oldPath = str_replace('/storage/', '', parse_url($currentImageUrl, PHP_URL_PATH) ?? '');

                if ($oldPath) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            return Storage::disk('public')->url($path);
        }

        return $payload['imageUrl'] ?? $currentImageUrl ?? '';
    }
}
