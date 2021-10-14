<?php

namespace App\Providers;

use Roots\Acorn\ServiceProvider;
use App\AssetPipeline\Assembly;
use App\AssetPipeline\Config;

class AssetPipelineProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(Assembly::class, function ($app) {
            $config = new Config(
                $app['config']['app.asset_pipeline.paths'],
                $app['config']['app.asset_pipeline.prefix'],
                $app['config']['app.asset_pipeline.output_path']
            );

            return new Assembly($config);
        });

    }

    public function provides()
    {
        return [
            Assembly::class,
        ];
    }

}
