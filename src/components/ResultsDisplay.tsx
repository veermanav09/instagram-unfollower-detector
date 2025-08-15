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

        <Card className="bg-success text-success-foreground hover-scale">
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

      {/* Results Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Not Following Back */}
        <Card className="hover-scale">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-full bg-destructive/10">
                  <UserMinus className="h-5 w-5 text-destructive" />
                </div>
                <span>Not Following You Back</span>
              </div>
              <Badge variant="destructive">{stats.notFollowingBackCount}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {notFollowingBack.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  🎉 Everyone you follow follows you back!
                </p>
              ) : (
                notFollowingBack.map((username, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <span className="font-medium">@{username}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`https://instagram.com/${username}`, '_blank')}
                    >
                      View Profile
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Mutual Followers */}
        <Card className="hover-scale">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-full bg-success/10">
                  <UserCheck className="h-5 w-5 text-success" />
                </div>
                <span>Mutual Followers</span>
              </div>
              <Badge className="bg-success text-success-foreground">{stats.mutualFollowersCount}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {mutualFollowers.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No mutual followers found
                </p>
              ) : (
                mutualFollowers.slice(0, 50).map((username, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <span className="font-medium">@{username}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`https://instagram.com/${username}`, '_blank')}
                    >
                      View Profile
                    </Button>
                  </div>
                ))
              )}
              {mutualFollowers.length > 50 && (
                <p className="text-xs text-muted-foreground text-center pt-2">
                  Showing first 50 of {mutualFollowers.length} mutual followers
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Button */}
      <div className="flex justify-center">
        <Button variant="gradient" size="lg" onClick={onExport}>
          <Download className="h-5 w-5 mr-2" />
          Export Results
        </Button>
      </div>
    </div>
  );
};