<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response('Laravel backend is running.', 200);
});
