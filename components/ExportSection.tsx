'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, FileText, Database } from 'lucide-react';
import { usePhotoStore } from '@/hooks/usePhotoStore';

export function ExportSection() {
  const { photos, fields } = usePhotoStore();

  const exportToCSV = () => {
    if (photos.length === 0) return;

    const headers = ['ファイル名', 'アップロード日時', ...fields.map(f => f.name)];
    const csvContent = [
      headers.join(','),
      ...photos.map(photo => [
        photo.filename,
        new Date(photo.uploadDate).toLocaleDateString('ja-JP'),
        ...fields.map(field => photo.extractedData[field.name] || '')
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `photo_data_${new Date().getTime()}.csv`;
    link.click();
  };

  const exportToJSON = () => {
    if (photos.length === 0) return;

    const jsonData = {
      exportDate: new Date().toISOString(),
      fields: fields,
      photos: photos.map(photo => ({
        filename: photo.filename,
        uploadDate: photo.uploadDate,
        extractedData: photo.extractedData,
      }))
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `photo_data_${new Date().getTime()}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            データエクスポート
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {photos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-dashed border-2">
                  <CardContent className="p-6 text-center space-y-4">
                    <FileText className="w-12 h-12 mx-auto text-green-600" />
                    <div>
                      <h3 className="font-semibold">CSV形式</h3>
                      <p className="text-sm text-gray-600">
                        Excelで開けるスプレッドシート形式
                      </p>
                    </div>
                    <Button onClick={exportToCSV} className="w-full">
                      CSVでダウンロード
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-dashed border-2">
                  <CardContent className="p-6 text-center space-y-4">
                    <Database className="w-12 h-12 mx-auto text-blue-600" />
                    <div>
                      <h3 className="font-semibold">JSON形式</h3>
                      <p className="text-sm text-gray-600">
                        プログラムで処理しやすいデータ形式
                      </p>
                    </div>
                    <Button onClick={exportToJSON} variant="outline" className="w-full">
                      JSONでダウンロード
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">エクスポート統計</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">写真数:</span>
                    <span className="font-medium ml-2">{photos.length}枚</span>
                  </div>
                  <div>
                    <span className="text-gray-600">フィールド数:</span>
                    <span className="font-medium ml-2">{fields.length}項目</span>
                  </div>
                  <div>
                    <span className="text-gray-600">最新アップロード:</span>
                    <span className="font-medium ml-2">
                      {photos.length > 0 
                        ? new Date(Math.max(...photos.map(p => new Date(p.uploadDate).getTime()))).toLocaleDateString('ja-JP')
                        : '-'
                      }
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">データ完全性:</span>
                    <span className="font-medium ml-2">
                      {Math.round((photos.filter(p => 
                        Object.values(p.extractedData).some(v => v)
                      ).length / photos.length) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Alert>
              <Download className="h-4 w-4" />
              <AlertDescription>
                エクスポートするデータがありません。まず写真をアップロードしてください。
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}