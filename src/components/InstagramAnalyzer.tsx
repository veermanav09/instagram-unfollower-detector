import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FileUpload } from './FileUpload';
import { TextInput } from './TextInput';
import { ResultsDisplay } from './ResultsDisplay';
import { InstructionCards } from './InstructionCards';
import { parseJSONData, parseHTMLData, parseTextData, processData, exportResults } from '@/utils/dataProcessor';
import { ProcessedData, InputMethod } from '@/types/instagram';
import { Instagram, FileText, Upload, Play, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const InstagramAnalyzer: React.FC = () => {
  const [inputMethod, setInputMethod] = useState<InputMethod>('json');
  const [followersFile, setFollowersFile] = useState<File | null>(null);
  const [followingFile, setFollowingFile] = useState<File | null>(null);
  const [followersText, setFollowersText] = useState('');
  const [followingText, setFollowingText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ProcessedData | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (file: File, type: 'followers' | 'following') => {
    if (type === 'followers') {
      setFollowersFile(file);
    } else {
      setFollowingFile(file);
    }
    
    toast({
      title: "File uploaded successfully",
      description: `${file.name} has been uploaded for ${type}`,
    });
  };

  const processFiles = async (followersFile: File, followingFile: File): Promise<{ followers: string[], following: string[] }> => {
    const readFileContent = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
      });
    };

    const followersContent = await readFileContent(followersFile);
    const followingContent = await readFileContent(followingFile);

    let followers: string[] = [];
    let following: string[] = [];

    // Detect file type and parse accordingly
    if (followersFile.name.endsWith('.json')) {
      followers = parseJSONData(followersContent, 'followers');
    } else if (followersFile.name.endsWith('.html')) {
      followers = parseHTMLData(followersContent);
    } else {
      followers = parseTextData(followersContent);
    }

    if (followingFile.name.endsWith('.json')) {
      following = parseJSONData(followingContent, 'following');
    } else if (followingFile.name.endsWith('.html')) {
      following = parseHTMLData(followingContent);
    } else {
      following = parseTextData(followingContent);
    }

    return { followers, following };
  };

  const handleAnalyze = async () => {
    setIsProcessing(true);
    
    try {
      let followers: string[] = [];
      let following: string[] = [];

      if (inputMethod === 'json' || inputMethod === 'html') {
        if (!followersFile || !followingFile) {
          toast({
            title: "Missing files",
            description: "Please upload both followers and following files",
            variant: "destructive",
          });
          return;
        }
        
        const data = await processFiles(followersFile, followingFile);
        followers = data.followers;
        following = data.following;
      } else {
        if (!followersText.trim() || !followingText.trim()) {
          toast({
            title: "Missing data",
            description: "Please provide both followers and following lists",
            variant: "destructive",
          });
          return;
        }
        
        followers = parseTextData(followersText);
        following = parseTextData(followingText);
      }

      if (followers.length === 0 || following.length === 0) {
        toast({
          title: "No data found",
          description: "Could not extract usernames from the provided data",
          variant: "destructive",
        });
        return;
      }

      const processedData = processData(followers, following);
      setResults(processedData);
      
      toast({
        title: "Analysis complete!",
        description: `Found ${processedData.notFollowingBack.length} accounts not following you back`,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: "There was an error processing your data. Please check your files and try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = () => {
    if (results) {
      exportResults(results);
      toast({
        title: "Results exported",
        description: "Your analysis results have been downloaded as a JSON file",
      });
    }
  };

  const canAnalyze = () => {
    if (inputMethod === 'json' || inputMethod === 'html') {
      return followersFile && followingFile;
    }
    return followersText.trim() && followingText.trim();
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-gradient-primary">
              <Instagram className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
            Instagram Unfollower Detector
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover who doesn't follow you back on Instagram with our comprehensive analysis tool
          </p>
          <div className="flex justify-center space-x-2 mt-4">
            <Badge className="bg-primary/10 text-primary">Privacy First</Badge>
            <Badge className="bg-success/10 text-success">No Login Required</Badge>
            <Badge className="bg-warning/10 text-warning">100% Free</Badge>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-8">
          <InstructionCards />
        </div>

        {/* Main Interface */}
        <Card className="mb-8 overflow-hidden">
          <CardHeader className="bg-gradient-primary text-white">
            <CardTitle className="flex items-center space-x-3">
              <Sparkles className="h-6 w-6" />
              <span>Choose Your Analysis Method</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={inputMethod} onValueChange={(value) => setInputMethod(value as InputMethod)}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="json" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>JSON Files</span>
                </TabsTrigger>
                <TabsTrigger value="text" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Copy & Paste</span>
                </TabsTrigger>
                <TabsTrigger value="html" className="flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>HTML Files</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="json" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FileUpload
                    uploadType="followers"
                    onFileUpload={handleFileUpload}
                    isUploaded={!!followersFile}
                    fileName={followersFile?.name}
                  />
                  <FileUpload
                    uploadType="following"
                    onFileUpload={handleFileUpload}
                    isUploaded={!!followingFile}
                    fileName={followingFile?.name}
                  />
                </div>
              </TabsContent>

              <TabsContent value="text" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <TextInput
                    type="followers"
                    label="Followers List"
                    placeholder="Paste your followers list here...&#10;username1&#10;username2&#10;username3"
                    value={followersText}
                    onChange={setFollowersText}
                  />
                  <TextInput
                    type="following"
                    label="Following List"
                    placeholder="Paste your following list here...&#10;username1&#10;username2&#10;username3"
                    value={followingText}
                    onChange={setFollowingText}
                  />
                </div>
              </TabsContent>

              <TabsContent value="html" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FileUpload
                    uploadType="followers"
                    onFileUpload={handleFileUpload}
                    isUploaded={!!followersFile}
                    fileName={followersFile?.name}
                  />
                  <FileUpload
                    uploadType="following"
                    onFileUpload={handleFileUpload}
                    isUploaded={!!followingFile}
                    fileName={followingFile?.name}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-center mt-8">
              <Button
                variant="hero"
                size="lg"
                onClick={handleAnalyze}
                disabled={!canAnalyze() || isProcessing}
                className={isProcessing ? "pulse-glow" : ""}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Start Analysis
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-accent text-white">
              <CardTitle className="flex items-center space-x-3">
                <Sparkles className="h-6 w-6" />
                <span>Analysis Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResultsDisplay data={results} onExport={handleExport} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};