<?php

namespace App\AssetPipeline;

class Config
{
    public array $paths;
    public string $prefix;
    public string $outputPath;

    public function __construct(array $paths, string $prefix, string $outputPath)
    {
        $this->paths = $paths;
        $this->prefix = $prefix;
        $this->outputPath = $outputPath;
    }
}
