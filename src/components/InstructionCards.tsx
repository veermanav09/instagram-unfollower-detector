import React from 'react';
import { Download, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

export const InstructionCards: React.FC = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="overflow-hidden hover-scale">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Download className="h-5 w-5 text-primary" />
            </div>
            <span>How to Download Instagram Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="download-steps" className="border-none">
              <AccordionTrigger className="py-2 text-left">
                <span className="text-sm font-medium">View Download Steps</span>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="space-y-4 mt-2">
                  <div className="bg-gradient-secondary rounded-lg p-4">
                    <h4 className="font-semibold text-sm mb-3 text-foreground">New Instagram Export Process:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                      <li>Open Instagram app or go to instagram.com</li>
                      <li>Navigate to <strong>Settings</strong></li>
                      <li>Select <strong>Meta Accounts Center</strong></li>
                      <li>Go to <strong>Your information and permissions</strong></li>
                      <li>Click <strong>Download your information</strong></li>
                      <li>Select your Instagram account</li>
                      <li>Choose <strong>Some of your information</strong></li>
                      <li>Select <strong>Followers and following</strong></li>
                      <li>Choose <strong>JSON</strong> format</li>
                      <li>Submit your request and wait for the download link</li>
                      <li>Extract ZIP and find:
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                          <li><code className="bg-muted px-1 rounded text-xs">connections/followers_1.json</code></li>
                          <li><code className="bg-muted px-1 rounded text-xs">connections/following.json</code></li>
                        </ul>
                      </li>
                    </ol>
                  </div>
                  
                  <div className="bg-warning/10 rounded-lg p-4">
                    <h4 className="font-semibold text-sm mb-2 text-foreground">💡 Pro Tip:</h4>
                    <p className="text-sm text-muted-foreground">
                      The download can take up to 48 hours. You'll receive an email when it's ready.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card className="overflow-hidden hover-scale">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <span>How to Use This Tool</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="usage-guide" className="border-none">
              <AccordionTrigger className="py-2 text-left">
                <span className="text-sm font-medium">View Usage Guide</span>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="space-y-4 mt-2">
                  <div className="bg-gradient-accent/10 rounded-lg p-4">
                    <h4 className="font-semibold text-sm mb-3 text-foreground">Three Input Methods:</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">1</div>
                        <div>
                          <span className="font-medium text-foreground">JSON Files</span>
                          <p className="text-muted-foreground text-xs mt-1">Upload your followers.json and following.json files directly</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">2</div>
                        <div>
                          <span className="font-medium text-foreground">Copy & Paste</span>
                          <p className="text-muted-foreground text-xs mt-1">Paste your followers and following lists as plain text</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">3</div>
                        <div>
                          <span className="font-medium text-foreground">HTML Files</span>
                          <p className="text-muted-foreground text-xs mt-1">Upload HTML files from Instagram data export</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-success/10 rounded-lg p-4">
                    <h4 className="font-semibold text-sm mb-3 text-foreground">📊 Analysis Results:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Users who don't follow you back</li>
                      <li>Your mutual followers</li>
                      <li>Detailed follower statistics</li>
                      <li>Export results for future reference</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};