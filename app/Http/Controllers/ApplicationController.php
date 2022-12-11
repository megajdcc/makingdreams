<?php

namespace App\Http\Controllers;

use App\User;
use App\Http\Controllers\Controller;
use App\Models\Sistema;

class ApplicationController extends Controller
{
    public function index()
    {
        $sistema = Sistema::get()->first();

        $app_name = $sistema->nombre;
        $app_logo = "/storage/logotipos/{$sistema->logotipo_oscuro}";

        return view('application',\compact('app_name','app_logo'));
    }
}
