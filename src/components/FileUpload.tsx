import React, { useCallback, useState } from 'react';
import { Upload, File, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileUpload: (file: File, type: 'followers' | 'following') => void;
  uploadType: 'followers' | 'following';
  isUploaded: boolean;
  fileName?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  uploadType,
  isUploaded,
  fileName
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const validateFile = (file: File): boolean => {
    const validTypes = ['application/json', 'text/html', 'text/plain'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.json') && !file.name.endsWith('.html')) {
      setError('Please upload a JSON or HTML file');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB');
      return false;
    }
    setError(null);
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && validateFile(file)) {
      onFileUpload(file, uploadType);
    }
  }, [onFileUpload, uploadType]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      onFileUpload(file, uploadType);
    }
  }, [onFileUpload, uploadType]);

  return (
    <Card className="p-6">
      <div
        className={cn(
          "upload-zone border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300",
          isDragOver ? "dragover" : "",
          isUploaded ? "border-success bg-success/5" : "border-border hover:border-primary/50",
          error ? "border-destructive bg-destructive/5" : ""
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id={`file-upload-${uploadType}`}
          className="hidden"
          accept=".json,.html"
          onChange={handleFileInput}
        />
        
        <div className="flex flex-col items-center space-y-4">
          {isUploaded ? (
            <>
              <div className="p-3 rounded-full bg-success/10">
                <File className="h-8 w-8 text-success" />
              </div>
              <div>
                <p className="font-medium text-success">File uploaded successfully</p>
                <p className="text-sm text-muted-foreground mt-1">{fileName}</p>
              </div>
            </>
          ) : (
            <>
              <div className="p-3 rounded-full bg-primary/10">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-medium">
                  Drop your {uploadType} file here
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Supports JSON and HTML files
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => document.getElementById(`file-upload-${uploadType}`)?.click()}
                className="hover-scale"
              >
                Choose File
              </Button>
            </>
          )}
        </div>
        
        {error && (
          <div className="flex items-center justify-center space-x-2 mt-4 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>
    </Card>
  );
};