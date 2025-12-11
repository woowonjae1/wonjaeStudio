"use client";

import { useState, useRef } from "react";
import { Upload, X, Music, Image } from "lucide-react";

interface FileUploadProps {
  accept: string;
  label: string;
  onChange: (file: File | null) => void;
  preview?: string;
  type: "image" | "audio";
}

export default function FileUpload({
  accept,
  label,
  onChange,
  preview,
  type,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(preview || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    onChange(selectedFile);

    if (selectedFile && type === "image") {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else if (selectedFile && type === "audio") {
      setPreviewUrl(selectedFile.name);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreviewUrl(null);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative border border-border rounded-lg p-4 bg-accent/50">
          {type === "image" ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-40 object-cover rounded"
            />
          ) : (
            <div className="flex items-center gap-3 py-4">
              <Music className="w-6 h-6 text-muted-foreground" />
              <span className="text-sm text-foreground truncate">
                {file?.name || previewUrl}
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className="w-full border-2 border-dashed border-border rounded-lg p-6 hover:border-primary hover:bg-accent/50 transition-colors flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          {type === "image" ? (
            <Image className="w-6 h-6" />
          ) : (
            <Music className="w-6 h-6" />
          )}
          <span className="text-sm font-medium">
            点击上传{type === "image" ? "图片" : "音频"}
          </span>
          <Upload className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
