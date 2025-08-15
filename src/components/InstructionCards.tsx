import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Download, Copy, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface InstructionCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const InstructionCard: React.FC<InstructionCardProps> = ({ title, icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="overflow-hidden hover-scale">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-primary/10">
                  {icon}
                </div>
                {title}
              </div>
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {children}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export const HowToDownloadCard: React.FC = () => (
  <InstructionCard
    title="How to Download Instagram Data"
    icon={<Download className="h-5 w-5 text-primary" />}
  >
    <div className="space-y-4">
      <div className="bg-gradient-secondary rounded-lg p-4">
        <h4 className="font-semibold text-sm mb-2">For JSON Files:</h4>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
          <li>Go to Instagram Settings → Privacy and Security</li>
          <li>Click "Data Download" → "Request Download"</li>
          <li>Select "JSON" format and submit request</li>
          <li>Wait for email with download link (can take up to 48 hours)</li>
          <li>Extract the ZIP file and look for:
            <ul className="list-disc list-inside ml-4 mt-1">
              <li><code className="bg-muted px-1 rounded">connections/followers_1.json</code></li>
              <li><code className="bg-muted px-1 rounded">connections/following.json</code></li>
            </ul>
          </li>
        </ol>
      </div>
      
      <div className="bg-warning/10 rounded-lg p-4">
        <h4 className="font-semibold text-sm mb-2">Alternative Method (HTML):</h4>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
          <li>Go to Instagram Settings → Privacy and Security</li>
          <li>Click "Data Download" → "Request Download"</li>
          <li>Select "HTML" format for faster processing</li>
          <li>Look for HTML files in the connections folder</li>
        </ol>
      </div>
    </div>
  </InstructionCard>
);

export const HowToUseCard: React.FC = () => (
  <InstructionCard
    title="How to Use This Tool"
    icon={<FileText className="h-5 w-5 text-primary" />}
  >
    <div className="space-y-4">
      <div className="bg-gradient-accent/10 rounded-lg p-4">
        <h4 className="font-semibold text-sm mb-2">Three Input Methods:</h4>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start space-x-2">
            <span className="font-medium text-primary">1. JSON Files:</span>
            <span>Upload your followers.json and following.json files</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-medium text-primary">2. Copy & Paste:</span>
            <span>Paste your followers and following lists as text</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-medium text-primary">3. HTML Files:</span>
            <span>Upload HTML files from Instagram data export</span>
          </div>
        </div>
      </div>
      
      <div className="bg-success/10 rounded-lg p-4">
        <h4 className="font-semibold text-sm mb-2">What You'll Get:</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li>List of people who don't follow you back</li>
          <li>Your mutual followers</li>
          <li>Detailed statistics and analytics</li>
          <li>Option to export results</li>
        </ul>
      </div>
    </div>
  </InstructionCard>
);

export const InstructionCards: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <HowToDownloadCard />
      <HowToUseCard />
    </div>
  );
};