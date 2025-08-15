import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Users, UserMinus, UserCheck, Download, TrendingUp } from 'lucide-react';
import { ProcessedData } from '@/types/instagram';

interface ResultsDisplayProps {
  data: ProcessedData;
  onExport: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ data, onExport }) => {
  const { followers, following, notFollowingBack, mutualFollowers } = data;
  
  const stats = {
    followersCount: followers.length,
    followingCount: following.length,
    notFollowingBackCount: notFollowingBack.length,
    mutualFollowersCount: mutualFollowers.length,
    followRatio: following.length > 0 ? (followers.length / following.length * 100).toFixed(1) : '0'
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-primary text-white hover-scale">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <div>
                <p className="text-xs opacity-90">Followers</p>
                <p className="text-2xl font-bold">{stats.followersCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-accent text-white hover-scale">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5" />
              <div>
                <p className="text-xs opacity-90">Following</p>
                <p className="text-2xl font-bold">{stats.followingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-destructive text-destructive-foreground hover-scale">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserMinus className="h-5 w-5" />
              <div>
                <p className="text-xs opacity-90">Not Following Back</p>
                <p className="text-2xl font-bold">{stats.notFollowingBackCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success to-green-600 text-success-foreground hover-scale shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <div>
                <p className="text-xs opacity-90">Follow Ratio</p>
                <p className="text-2xl font-bold">{stats.followRatio}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Not Following Back - Full Width with Enhanced Design */}
      <Card className="overflow-hidden hover-scale bg-gradient-to-br from-background to-destructive/5 border-destructive/20">
        <CardHeader className="bg-gradient-to-r from-destructive/10 to-destructive/5 border-b border-destructive/20">
          <CardTitle className="flex items-center justify-between text-xl">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-full bg-destructive text-destructive-foreground shadow-lg animate-pulse">
                <UserMinus className="h-6 w-6" />
              </div>
              <div>
                <span className="text-destructive">People Not Following You Back</span>
                <p className="text-sm text-muted-foreground font-normal">Users you follow who don't follow you</p>
              </div>
            </div>
            <Badge variant="destructive" className="text-lg px-3 py-1 shadow-md">
              {stats.notFollowingBackCount}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {notFollowingBack.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="text-8xl mb-6 animate-bounce">🎉</div>
              <h3 className="text-2xl font-bold text-success mb-2">Perfect Follow Ratio!</h3>
              <p className="text-lg text-muted-foreground">
                Everyone you follow follows you back!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {notFollowingBack.map((username, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-background to-muted/30 border border-border hover:border-destructive/30 hover:shadow-lg transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-destructive to-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                      {username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-semibold text-destructive group-hover:text-red-700 transition-colors">
                        @{username}
                      </span>
                      <p className="text-xs text-muted-foreground">Not following back</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => window.open(`https://instagram.com/${username}`, '_blank')}
                  >
                    <Users className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Button */}
      <div className="flex justify-center animate-fade-in">
        <Button 
          variant="gradient" 
          size="lg" 
          onClick={onExport}
          className="px-8 py-4 text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_200%] animate-gradient-x"
        >
          <Download className="h-5 w-5 mr-3" />
          <span className="font-semibold">Export Detailed Report</span>
        </Button>
      </div>
    </div>
  );
};