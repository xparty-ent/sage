<?php

namespace App\AssetPipeline;

class Processor
{
    public const MANIFEST_FILENAME = ".manifest.json";
    private Assembly $assembly;
    private Config $config;
    private PathLoader $loadPath;

    public function __construct(Assembly $assembly)
    {
        $this->assembly = $assembly;
        $this->config = $assembly->config;
        $this->loadPath = $assembly->loadPath();
    }

    public function process(): void
    {
        $outputPath = $this->config->outputPath;

        if (!file_exists($outputPath)) {
            mkdir($this->config->outputPath, 0777, true);
        }

        file_put_contents($outputPath . "/" . self::MANIFEST_FILENAME, json_encode($this->loadPath->manifest(),  JSON_UNESCAPED_SLASHES));

        $assets = array_values($this->loadPath->assetsByPath);

        foreach($assets as $asset) {
            $assetDir = $outputPath . dirname($asset->digestedPath());

            if (!file_exists($assetDir)) {
                mkdir($assetDir, 0777, true);
            }

            $this->outputAsset($asset);
            $this->compressAsset($asset);
        }

    }

    public function clean(): void
    {
        if (file_exists($this->config->outputPath)) {
            rmdir($this->config->outputPath);
        }
    }

    private function compressAsset(Asset $asset): void
    {
        // TODO: implement brotli compression
    }

    private function outputAsset(Asset $asset): void
    {
        $fullDigestedPath = $this->config->outputPath . $asset->digestedPath();

        if ($this->assembly->compilableAsset($asset)) {
            file_put_contents($fullDigestedPath, $this->assembly->compile($asset));
        } else {
            copy($asset->path, $fullDigestedPath);
        }
    }
}

