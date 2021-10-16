<?php

namespace App\AssetPipeline;

class Config
{
    public array $paths;
    public string $prefix;
    public string $outputPath;
    public array $compilers;

    public function __construct(array $paths = ['resources'], string $prefix = 'assets', string $outputPath = 'public', array $compilers = [])
    {
        $this->paths = $paths;
        $this->prefix = $prefix;
        // TODO: better way to set root path?
        $this->outputPath = get_template_directory() . "/" . $outputPath;
        $this->compilers = $compilers;
    }
}
