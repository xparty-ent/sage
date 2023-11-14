<?php

namespace App\View\Composers;

use Roots\Acorn\View\Composer;

class Home extends Composer
{
    /**
     * List of views served by this composer.
     *
     * @var string[]
     */
    protected static $views = [
        'page-home'
    ];

    /**
     * Data to be passed to view before rendering.
     *
     * @return array
     */
    public function with()
    {
        return [
            'icosphere' => asset('/models/xp-icosphere.glb'),
            'torus' => asset('/models/xp-torus.glb'),
            'armature' => asset('/models/xp-armature.glb')
        ];
    }
}
