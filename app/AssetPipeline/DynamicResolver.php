<?php

namespace App\AssetPipeline;

class DynamicResolver
{
    public PathLoader $pathLoader;
    public string $prefix;

    public function __construct(PathLoader $pathLoader, string $prefix)
    {
        $this->pathLoader = $pathLoader;
        $this->prefix = $prefix;
    }

    public function resolve(string $logicalPath)
    {
        $asset = $this->pathLoader->find($logicalPath);

        if (isset($asset)) {
            return "/" . $this->prefix . $asset->digestedPath();
        }
    }
}
