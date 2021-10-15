<?php

namespace App\AssetPipeline\Compilers;

use App\AssetPipeline\Assembly;

class CssAssetUrls
{
    private const ASSET_URL_PATTERN = "/url\(\s*[\"']?(?!(?:\#|data|http))([^\"'\s)]+)\s*[\"']?\)/";
    public Assembly $assembly;

    public function __construct(Assembly $assembly)
    {
        $this->assembly = $assembly;
    }

    public function compile(string $logicalPath, string $input)
    {
        return preg_replace_callback(self::ASSET_URL_PATTERN, function ($matches) use ($logicalPath, $input) {
            $resolvedPath = $this->resolvePath(dirname($logicalPath), $matches[1]);
            $assetPath = $this->assembly->config->prefix . $this->assembly->loadPath()->find("/{$resolvedPath}")->digestedPath();
            return "url('/{$assetPath}')";
        }, $input);
    }

    private function resolvePath(string $directory, string $filename)
    {
        if (str_starts_with($filename, "../")) {
            return $this->resolveRelativePath($directory, $filename);
        } elseif (str_starts_with($filename, "/")) {
            return ltrim($filename, "/");
        } else {
            return $directory . ltrim($filename, "/");
        }
    }

	private function resolveRelativePath(string $directory, string $filename) {
	  $path = [];

	  foreach(explode('/', $filename) as $part) {
		// ignore parts that have no value
		if (empty($part) || $part === '.') continue;

		if ($part !== '..') {
		  array_push($path, $part);
		}
		else if (count($path) > 0) {
		  array_pop($path);
		}
	  }

	  //array_unshift($path, $directory);

	  return join('/', $path);
	}

}

