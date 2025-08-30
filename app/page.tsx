'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PhotoUploader } from '@/components/PhotoUploader';
import { FieldConfigSection } from '@/components/FieldConfigSection';
import { PhotoGallery } from '@/components/PhotoGallery';
import { ExportSection } from '@/components/ExportSection';
import { Camera, Settings, Image, Download } from 'lucide-react';
import { usePhotoStore } from '@/hooks/usePhotoStore';

export default function Home() {
  const { photos, fields, setFields } = usePhotoStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Smart Photo Info Extractor
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            写真をアップロードして、画像認識技術で自動的に情報を抽出・整理します
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="secondary" className="text-sm">
              <Camera className="w-4 h-4 mr-1" />
              Google Vision API
            </Badge>
            <Badge variant="outline" className="text-sm">
              カスタムフィールド対応
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              アップロード
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              フィールド設定
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              ギャラリー
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              エクスポート
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <PhotoUploader />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <FieldConfigSection />
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6">
            <PhotoGallery />
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <ExportSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}