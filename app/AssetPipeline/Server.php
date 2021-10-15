<?php

namespace App\AssetPipeline;

class Server
{
    public static function call(string $path)
    {
        $digest = null;
        $assembly = \Roots\Acorn\Application::getInstance()->make(Assembly::class);
        $prefix = $assembly->config->prefix;

        if (!str_starts_with($path, $prefix . "/")) {
            return;
        }

        if (preg_match("/-([0-9a-f]{7,128})\.(?!digested)[^.]+$/", $path, $matches)) {
            $digest = $matches[1];
            $path = str_replace("-{$digest}", "", $path);
        }



        $path = str_replace($prefix . "/", "", $path);
        $asset = $assembly->loadPath()->find("/" . $path);

        if (isset($asset) && $asset->isFresh("{$digest}")) {
            $content = $assembly->compile($asset);

            header("Content-Length: " . strlen($content), true);
            header("Content-Type: " . $asset->contentType(), true);
            header("Accept-Encoding: Vary", true);
            header("ETag: \"" . $asset->digest() . "\"");
            header("Cache-Control: public, max-age=31536000, immutable", true);

            print $content;
            exit();
        }
    }
}

