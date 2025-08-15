import React from 'react';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { FileText } from 'lucide-react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  type: 'followers' | 'following';
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  placeholder,
  label,
  type
}) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <Label htmlFor={`text-input-${type}`} className="text-base font-medium">
            {label}
          </Label>
        </div>
        
        <Textarea
          id={`text-input-${type}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[200px] resize-none"
        />
        
        <p className="text-xs text-muted-foreground">
          Paste your {type} list with usernames separated by lines or commas
        </p>
      </div>
    </Card>
  );
};