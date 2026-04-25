<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('ktoba:about', function (): void {
    $this->info('Ktoba School API is ready for MongoDB Atlas and JWT auth.');
});
