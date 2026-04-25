# Backend Notes

This folder contains the custom Ktoba School Laravel API layer:

- API routes
- controllers
- models
- middleware
- MongoDB config
- JWT config
- seeders

Because `php` and `composer` were not available in the current workspace, this directory was authored as a Laravel-ready overlay instead of being generated from `laravel new`.

## Recommended Run Strategy

1. Start from a fresh Laravel 11 application.
2. Copy the files from this folder into that app.
3. Install dependencies:

```bash
composer require mongodb/laravel-mongodb:^5.6
composer require php-open-source-saver/jwt-auth:^2.8
```

4. Copy `.env.example` to `.env`.
5. Generate keys:

```bash
php artisan key:generate
php artisan jwt:secret --force
```

6. Seed the database:

```bash
php artisan db:seed
```

7. Run the server:

```bash
php artisan serve
```
