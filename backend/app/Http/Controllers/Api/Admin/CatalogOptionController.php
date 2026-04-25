<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\CatalogOption;
use App\Support\AuditLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CatalogOptionController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'subjects' => CatalogOption::query()->where('type', 'subject')->orderBy('name')->get(),
            'levels' => CatalogOption::query()->where('type', 'level')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'type' => ['required', 'in:subject,level'],
            'name' => ['required', 'string', 'max:120'],
        ]);

        $option = CatalogOption::query()->create([
            ...$payload,
            'createdAt' => now(),
        ]);

        AuditLogger::record($request->user(), 'catalog-options.created', [
            'optionId' => (string) $option->getKey(),
            'type' => $option->type,
        ]);

        return response()->json([
            'message' => 'Catalog option created.',
            'option' => $option,
        ], Response::HTTP_CREATED);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $option = CatalogOption::query()->findOrFail($id);
        $option->delete();

        AuditLogger::record($request->user(), 'catalog-options.deleted', [
            'optionId' => $id,
        ]);

        return response()->json([
            'message' => 'Catalog option deleted.',
        ]);
    }
}
