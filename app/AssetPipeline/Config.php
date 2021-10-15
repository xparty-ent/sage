<?php

namespace App\AssetPipeline;

class Config
{
    public array $paths;
    public string $prefix;
    public string $outputPath;
    public array $compilers;

    public function __construct(array $paths = ['resources'], string $prefix = 'assets', string $outputPath = 'dist', array $compilers = [])
    {
        $this->paths = $paths;
        $this->prefix = $prefix;
        $this->outputPath = $outputPath;
        $this->compilers = $compilers;
    }
}
