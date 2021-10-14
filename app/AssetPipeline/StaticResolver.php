<?php

namespace App\AssetPipeline;

class StaticResolver
{
    public string $manifestPath;
    public string $prefix;

    public function __construct(string $manifestPath, string $prefix)
    {
        $this->prefix = $prefix;
        $this->manifest = json_decode(file_get_contents($manifestPath));
    }

    public function resolve(string $logicalPath)
    {
        $assetPath = $this->manifest->{$logicalPath};

        if (isset($assetPath)) {
            return $this->prefix . "/" . $assetPath;
        }
    }
}
