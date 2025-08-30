'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Image, Edit3, Trash2, Calendar, Eye } from 'lucide-react';
import { usePhotoStore } from '@/hooks/usePhotoStore';

export function PhotoGallery() {
  const { photos, updatePhoto, deletePhoto } = usePhotoStore();
  const [editingPhoto, setEditingPhoto] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, string>>({});

  const handleEdit = (photoId: string) => {
    const photo = photos.find(p => p.id === photoId);
    if (photo) {
      setEditingPhoto(photoId);
      setEditData(photo.extractedData);
    }
  };

  const saveEdit = () => {
    if (editingPhoto) {
      updatePhoto(editingPhoto, { extractedData: editData });
      setEditingPhoto(null);
      setEditData({});
    }
  };

  const cancelEdit = () => {
    setEditingPhoto(null);
    setEditData({});
  };

  if (photos.length === 0) {
    return (
      <Alert>
        <Image className="h-4 w-4" />
        <AlertDescription>
          まだ写真がアップロードされていません。「アップロード」タブから写真を追加してください。
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">写真ギャラリー</h2>
        <Badge variant="outline">{photos.length}枚の写真</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square relative">
              <img
                src={photo.imageUrl}
                alt={photo.filename}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>{photo.filename}</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <img
                          src={photo.imageUrl}
                          alt={photo.filename}
                          className="w-full rounded-lg"
                        />
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-semibold">抽出された情報</h3>
                        <div className="space-y-2">
                          {Object.entries(photo.extractedData).map(([key, value]) => (
                            <div key={key} className="grid grid-cols-3 gap-2">
                              <Label className="text-sm font-medium">{key}:</Label>
                              <span className="col-span-2 text-sm">{value || '未検出'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0"
                  onClick={() => handleEdit(photo.id)}
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-8 w-8 p-0"
                  onClick={() => deletePhoto(photo.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  {new Date(photo.uploadDate).toLocaleDateString('ja-JP')}
                </div>
                
                <div className="space-y-2">
                  {Object.entries(photo.extractedData).slice(0, 3).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">{key}:</span>
                      <span className="text-gray-600 truncate ml-2">
                        {value || '未検出'}
                      </span>
                    </div>
                  ))}
                  {Object.keys(photo.extractedData).length > 3 && (
                    <p className="text-xs text-gray-500">
                      +{Object.keys(photo.extractedData).length - 3}項目
                    </p>
                  )}
                </div>
              </div>

              {/* Edit Mode */}
              {editingPhoto === photo.id && (
                <div className="mt-4 pt-4 border-t space-y-3">
                  <Label className="text-sm font-medium">情報を編集</Label>
                  {Object.keys(photo.extractedData).map((key) => (
                    <div key={key} className="space-y-1">
                      <Label className="text-xs">{key}</Label>
                      <Input
                        value={editData[key] || ''}
                        onChange={(e) => setEditData(prev => ({
                          ...prev,
                          [key]: e.target.value,
                        }))}
                        placeholder={`${key}を入力`}
                        className="h-8"
                      />
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveEdit}>
                      保存
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit}>
                      キャンセル
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}