<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\CatalogOption;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['Math', 'PC', 'SVT', 'FranÃ§ais', 'English', 'Arabic'] as $subject) {
            CatalogOption::query()->updateOrCreate(
                ['type' => 'subject', 'name' => $subject],
                ['createdAt' => now()],
            );
        }

        foreach (['Primaire', 'CollÃ¨ge', 'LycÃ©e'] as $level) {
            CatalogOption::query()->updateOrCreate(
                ['type' => 'level', 'name' => $level],
                ['createdAt' => now()],
            );
        }

        $admin = User::query()->updateOrCreate(
            ['email' => 'admin@ktoba.ma'],
            [
                'name' => 'Super',
                'lastname' => 'Admin',
                'phone' => '+212600000001',
                'passwordHash' => Hash::make('123456789'),
                'role' => 'admin',
                'subject' => null,
                'level' => null,
                'createdAt' => now(),
            ],
        );

        $ilyas = User::query()->updateOrCreate(
            ['email' => 'ilyas@ktoba.ma'],
            [
                'name' => 'Ilyas',
                'lastname' => 'Math',
                'phone' => '+212600000010',
                'passwordHash' => Hash::make('teacher123'),
                'role' => 'formateur',
                'subject' => 'Math',
                'level' => 'LycÃ©e',
                'createdAt' => now(),
            ],
        );

        $oussama = User::query()->updateOrCreate(
            ['email' => 'oussama@ktoba.ma'],
            [
                'name' => 'Oussama',
                'lastname' => 'SVT',
                'phone' => '+212600000011',
                'passwordHash' => Hash::make('teacher123'),
                'role' => 'formateur',
                'subject' => 'SVT',
                'level' => 'CollÃ¨ge',
                'createdAt' => now(),
            ],
        );

        User::query()->updateOrCreate(
            ['email' => 'user@ktoba.ma'],
            [
                'name' => 'Imane',
                'lastname' => 'Alaoui',
                'phone' => '+212600000100',
                'passwordHash' => Hash::make('student123'),
                'role' => 'utilisateur',
                'subject' => null,
                'level' => 'LycÃ©e',
                'createdAt' => now(),
            ],
        );

        Book::query()->updateOrCreate(
            ['title' => 'Math Premium Terminale'],
            [
                'description' => 'Livre premium pour algÃ¨bre, analyse et prÃ©paration bac.',
                'imageUrl' => 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80',
                'pdfUrl' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                'subject' => 'Math',
                'level' => 'LycÃ©e',
                'createdBy' => (string) $ilyas->getKey(),
                'createdAt' => now(),
            ],
        );

        Book::query()->updateOrCreate(
            ['title' => 'SVT Focus CollÃ¨ge'],
            [
                'description' => 'Livre de SVT pour collÃ¨ge, schÃ©mas, rÃ©sumÃ©s et mini-Ã©valuations.',
                'imageUrl' => 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80',
                'pdfUrl' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                'subject' => 'SVT',
                'level' => 'CollÃ¨ge',
                'createdBy' => (string) $oussama->getKey(),
                'createdAt' => now(),
            ],
        );

        Book::query()->updateOrCreate(
            ['title' => 'Physique Chimie Express'],
            [
                'description' => 'LeÃ§ons structurÃ©es et applications numÃ©riques pour PC.',
                'imageUrl' => 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
                'pdfUrl' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                'subject' => 'PC',
                'level' => 'LycÃ©e',
                'createdBy' => (string) $admin->getKey(),
                'createdAt' => now(),
            ],
        );
    }
}
