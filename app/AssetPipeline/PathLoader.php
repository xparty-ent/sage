<?php

namespace App\AssetPipeline;

class PathLoader
{
    public array $paths;
    public array $assetsByPath;

    public function __construct(array $paths)
    {
        $themeDir = get_template_directory();

        $this->paths = array_map(function ($path) use ($themeDir) {
            return realpath($themeDir . "/" . $path);
        }, $paths);

        $this->assetsByPath = $this->computeRelativeAssetPaths();
    }

    public function find(string $assetName)
    {
        return $this->assetsByPath[$assetName] ?? null;
    }

    public function manifest()
    {
        return array_reduce(array_values($this->assetsByPath), function ($manifest, $asset) {
            $manifest[$asset->logicalPath] = $asset->digestedPath();
            return $manifest;
        }, []);
    }

    private function computeRelativeAssetPaths()
    {
        $mappedAssets = [];

        $paths = array_filter($this->paths, function($path) {
            return file_exists($path);
        });

        foreach($paths as $path) {
            $it = new \RecursiveDirectoryIterator($path, \RecursiveDirectoryIterator::SKIP_DOTS);

            foreach(new \RecursiveIteratorIterator($it) as $file) {
                // TODO: skip hidden files like `.gitkeep`?
                // TODO: is this correct always?
                $logicalPath = str_replace($path, "", $file->getPathname());
                $mappedAssets[$logicalPath] = new Asset($file->getPathname(), $logicalPath);
            }
        }

        return $mappedAssets;
    }
}
