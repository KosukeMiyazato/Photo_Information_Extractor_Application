'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, X, Settings, Wine, Info } from 'lucide-react';
import { usePhotoStore } from '@/hooks/usePhotoStore';

const PRESET_TEMPLATES = [
  {
    name: 'ワイン情報',
    icon: Wine,
    fields: ['ワイン名', '生産者', '品種', 'AOC', '産地', 'ヴィンテージ', '価格']
  },
  {
    name: '商品情報',
    icon: Info,
    fields: ['商品名', 'ブランド', 'モデル', '価格', '製造年', '色', 'サイズ']
  }
];

export function FieldConfigSection() {
  const { fields, setFields } = usePhotoStore();
  const [newFieldName, setNewFieldName] = useState('');

  const addField = () => {
    if (newFieldName.trim() && !fields.find(f => f.name === newFieldName.trim())) {
      const newField = {
        id: Date.now().toString(),
        name: newFieldName.trim(),
        type: 'text' as const,
      };
      setFields([...fields, newField]);
      setNewFieldName('');
    }
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const applyTemplate = (templateFields: string[]) => {
    const newFields = templateFields.map((fieldName, index) => ({
      id: `${Date.now()}_${index}`,
      name: fieldName,
      type: 'text' as const,
    }));
    setFields(newFields);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            抽出フィールド設定
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preset Templates */}
          <div>
            <Label className="text-base font-medium mb-3 block">テンプレート</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRESET_TEMPLATES.map((template) => (
                <Card key={template.name} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <template.icon className="w-5 h-5 text-blue-600" />
                      <h3 className="font-medium">{template.name}</h3>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.fields.slice(0, 4).map((field) => (
                        <Badge key={field} variant="secondary" className="text-xs">
                          {field}
                        </Badge>
                      ))}
                      {template.fields.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.fields.length - 4}項目
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => applyTemplate(template.fields)}
                      className="w-full"
                    >
                      このテンプレートを使用
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <Label className="text-base font-medium mb-3 block">カスタムフィールド</Label>
            
            {/* Add New Field */}
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="新しいフィールド名を入力"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addField()}
                className="flex-1"
              />
              <Button onClick={addField} disabled={!newFieldName.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                追加
              </Button>
            </div>

            {/* Current Fields */}
            {fields.length > 0 ? (
              <div className="space-y-3">
                <Label className="text-sm font-medium">設定済みフィールド</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {fields.map((field) => (
                    <div
                      key={field.id}
                      className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                    >
                      <span className="text-sm font-medium">{field.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeField(field.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  抽出したい情報のフィールドを設定してください。例：ワイン名、生産者、品種など
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}