<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class ServiceWorkerController extends Controller
{
    public function getServiceWorker() {
        $sw_path = resource_path('scripts/sw/sw.js');
        $sw_file = File::get($sw_path);

        return response($sw_file, 200, [
            'Content-Type' => 'application/javascript'
        ]);
    }
}
