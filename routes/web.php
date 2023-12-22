<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ServiceWorkerController;
use Illuminate\Support\Facades\Route;

Route::get('/sw', [ServiceWorkerController::class, 'getServiceWorker'])
    ->name('sw');
Route::post('/account/login', [AuthController::class, 'login']);