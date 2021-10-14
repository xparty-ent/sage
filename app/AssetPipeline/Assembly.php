<?php

namespace App\AssetPipeline;

class Assembly
{
    private const MANIFEST_FILENAME = "manifest.json";
    public Config $config;

    public function __construct(Config $config)
    {
        $this->config = $config;
    }

    public function loadPath()
    {
        $this->pathLoader ??= new PathLoader($this->config->paths);
        return $this->pathLoader;
    }

    public function resolver()
    {
        $manifestPath = realpath(get_template_directory() . "/" . $this->config->outputPath . "/" . $this::MANIFEST_FILENAME);
        if (file_exists($manifestPath)) {
            return new StaticResolver($manifestPath, $this->config->prefix);
        } else {
            return new DynamicResolver($this->loadPath(), $this->config->prefix);
        }
    }
}
