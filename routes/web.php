<?php

use App\Http\Controllers\MitraController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Route::get('/reports', [ReportController::class, 'index']);
// Route::get('/reports/add', [ReportController::class, 'index2']);
// Route::post('/reports', [ReportController::class, 'store']);
// Route::delete('/reports/{id}', [ReportController::class, 'destroy']);
// Route::get('/reports/map', [ReportController::class, 'map']);

Route::prefix('reports')
    ->controller(ReportController::class)
    ->name('reports.')
    ->group(function () {

        Route::get('/', 'index')->name('index');

        Route::get('/add', 'index2')->name('add');

        Route::post('/', 'store')->name('store');

        Route::patch('/','update')->name('update');

        Route::delete('/{id}', 'destroy')->name('destroy');

        Route::get('/map', 'map')->name('map');

    });

Route::prefix('mitra')
    ->controller(MitraController::class)
    ->name('mitra.')
    ->group(function () {
        Route::get('/', 'index')->name('index');
    });


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware([
    'auth',
    'role:admin'
])->group(function () {
    Route::resource('users', UserController::class);
});

require __DIR__.'/auth.php';
