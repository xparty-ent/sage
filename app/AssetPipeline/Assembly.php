<?php

namespace App\AssetPipeline;

class Assembly
{
    public Config $config;

    public function __construct(Config $config)
    {
        $this->config = $config;
    }

    public function compilableAsset(Asset $asset): bool
    {
        return array_key_exists($asset->contentType(), $this->config->compilers);
    }

    public function compile(Asset $asset): string
    {
        $content = $asset->content();

        $compilers = $this->config->compilers[$asset->contentType()] ?? null;

        if (!$compilers) {
            return $asset->content();
        }

        foreach($compilers as $compilerClassName) {
            $compiler = new $compilerClassName($this);
            $content = $compiler->compile($asset->logicalPath, $content);
        }

        return $content;
    }

    public function loadPath(): PathLoader
    {
        $this->pathLoader ??= new PathLoader($this->config->paths);
        return $this->pathLoader;
    }

    public function processor(): Processor
    {
        return new Processor($this);
    }

    public function resolver()
    {
        $manifestPath = $this->config->outputPath . "/" . Processor::MANIFEST_FILENAME;
        if (file_exists($manifestPath)) {
            return new StaticResolver($manifestPath, $this->config->prefix);
        } else {
            return new DynamicResolver($this->loadPath(), $this->config->prefix);
        }
    }
}
