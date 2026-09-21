<?php

use App\Http\Controllers\BuildingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FlatController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TenantController;
use App\Http\Controllers\RentInvoiceController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ReportsController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('buildings', BuildingController::class)->except(['show']);
    Route::resource('flats', FlatController::class)->except(['show']);
    Route::resource('tenants', TenantController::class);
    Route::post('tenants/scan-nid', [TenantController::class, 'scanNid'])->name('tenants.scan-nid');
    Route::resource('invoices', RentInvoiceController::class)->except(['edit','update','destroy']);
    Route::post('payments', [PaymentController::class, 'store'])->name('payments.store');
    Route::get('reports', [ReportsController::class, 'index'])->name('reports.index');
    Route::get('invoices/{invoice}/receipt', [RentInvoiceController::class, 'receipt'])->name('invoices.receipt');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
