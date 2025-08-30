'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileImage, Loader2, Check, AlertCircle, Camera } from 'lucide-react';
import { usePhotoStore } from '@/hooks/usePhotoStore';
import { analyzeImage } from '@/lib/vision-api';

interface UploadState {
  file: File | null;
  uploading: boolean;
  analyzing: boolean;
  progress: number;
  error: string | null;
  success: boolean;
}

export function PhotoUploader() {
  const { fields, addPhoto } = usePhotoStore();
  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    uploading: false,
    analyzing: false,
    progress: 0,
    error: null,
    success: false,
  });

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadState(prev => ({
        ...prev,
        file,
        error: null,
        success: false,
      }));
    } else {
      setUploadState(prev => ({
        ...prev,
        error: '画像ファイルを選択してください',
      }));
    }
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setUploadState(prev => ({
        ...prev,
        file,
        error: null,
        success: false,
      }));
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const processImage = async () => {
    if (!uploadState.file || fields.length === 0) {
      setUploadState(prev => ({
        ...prev,
        error: 'ファイルとフィールド設定が必要です',
      }));
      return;
    }

    setUploadState(prev => ({
      ...prev,
      uploading: true,
      analyzing: true,
      progress: 20,
      error: null,
    }));

    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.readAsDataURL(uploadState.file!);
      });

      setUploadState(prev => ({ ...prev, progress: 40 }));

      // Analyze image with Google Vision API
      const extractedText = await analyzeImage(base64);
      
      setUploadState(prev => ({ ...prev, progress: 70 }));

      // Extract field information from text
      const extractedData: Record<string, string> = {};
      fields.forEach(field => {
        // Simple text matching - in production, you'd use more sophisticated NLP
        const pattern = new RegExp(`${field.name}[：:]?\\s*([^\\n\\r]+)`, 'i');
        const match = extractedText.match(pattern);
        extractedData[field.name] = match?.[1]?.trim() || '';
      });

      // Create photo record
      const photoData = {
        id: Date.now().toString(),
        filename: uploadState.file.name,
        uploadDate: new Date().toISOString(),
        imageUrl: URL.createObjectURL(uploadState.file),
        extractedData,
        rawText: extractedText,
      };

      addPhoto(photoData);

      setUploadState(prev => ({
        ...prev,
        progress: 100,
        analyzing: false,
        success: true,
      }));

      // Reset after success
      setTimeout(() => {
        setUploadState({
          file: null,
          uploading: false,
          analyzing: false,
          progress: 0,
          error: null,
          success: false,
        });
      }, 2000);

    } catch (error) {
      setUploadState(prev => ({
        ...prev,
        uploading: false,
        analyzing: false,
        error: error instanceof Error ? error.message : '画像の解析に失敗しました',
      }));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            写真をアップロード
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              uploadState.file ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {uploadState.file ? (
              <div className="space-y-4">
                <div className="w-32 h-32 mx-auto relative rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(uploadState.file)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-gray-600">{uploadState.file.name}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <FileImage className="w-12 h-12 mx-auto text-gray-400" />
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    ここに画像をドラッグ&ドロップ
                  </p>
                  <p className="text-sm text-gray-500">または下のボタンから選択</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" className="flex items-center gap-2 pointer-events-none">
                <Upload className="w-4 h-4" />
                ファイルを選択
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          {uploadState.uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  {uploadState.analyzing ? '画像を解析中...' : 'アップロード中...'}
                </span>
                <span>{uploadState.progress}%</span>
              </div>
              <Progress value={uploadState.progress} className="w-full" />
            </div>
          )}

          {/* Error Alert */}
          {uploadState.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{uploadState.error}</AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {uploadState.success && (
            <Alert className="border-green-200 bg-green-50">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                写真の解析が完了しました！ギャラリータブで確認できます。
              </AlertDescription>
            </Alert>
          )}

          {/* Process Button */}
          <div className="flex justify-center">
            <Button
              onClick={processImage}
              disabled={!uploadState.file || fields.length === 0 || uploadState.uploading}
              className="min-w-32"
            >
              {uploadState.analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  解析中...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  解析開始
                </>
              )}
            </Button>
          </div>

          {fields.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                まず「フィールド設定」タブで抽出したい項目を設定してください。
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}