<?php

namespace App\AssetPipeline;

//use SplFileInfo;

class Asset
{
    public string $path;
    public string $logicalPath;

    private $content;
    private $contentType;
    private $length;
    private $digest;
    private $digestedPath;

    public function __construct(string $path, string $logicalPath)
    {
        $this->path = $path;
        $this->logicalPath = $logicalPath;
    }

    public function content(): string
    {
        if ($this->content) {
            return $this->content;
        }

        return $this->content = file_get_contents($this->path);
    }

    // TODO: mime_content_type is inaccurate
    public function contentType(): string
    {
        if ($this->contentType ?? null) {
            return $this->contentType;
        }

        $ext = pathinfo($this->path, PATHINFO_EXTENSION);
        $contentType = "text/plain";

        switch($ext) {
        case "js":
            $contentType = "application/javascript";
            break;
        case "css":
            $contentType = "text/css";
            break;
        default:
            $contentType = mime_content_type($this->path);
        }

        return $this->contentType = $contentType;
    }

    public function isFresh(string $digest): bool
    {
        return $this->digest() === $digest || $this->alreadyDigested();
    }

    public function length(): int
    {
        if ($this->length) {
            return $this->length;
        }

        return $this->length = filesize($this->path);
    }

    public function digest(): string
    {
        if ($this->digest) {
            return $this->digest;
        }

        return $this->digest = sha1_file($this->path);
    }

    public function digestedPath(): string
    {
        if ($this->digestedPath) {
            return $this->digestedPath;
        }

        if ($this->alreadyDigested()) {
            $this->digestedPath = $this->logicalPath;
        } else {
            $this->digestedPath = preg_replace("/\.(\w+)$/", "-" . $this->digest() . ".$1", $this->logicalPath);
        }

        return $this->digestedPath;
    }

    private function alreadyDigested(): bool
    {
        return preg_match("/-([0-9a-f]{7,128})\.digested/", $this->logicalPath);
    }
}
