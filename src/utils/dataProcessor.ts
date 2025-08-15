import { FollowersData, FollowingData, ProcessedData } from '@/types/instagram';

export const parseJSONData = (content: string, type: 'followers' | 'following'): string[] => {
  try {
    console.log(`Parsing ${type} data, content length:`, content.length);
    const data = JSON.parse(content);
    console.log(`Parsed ${type} data structure:`, data);
    
    if (type === 'followers') {
      const followersData = data as FollowersData;
      console.log('Followers data structure:', followersData);
      if (followersData.relationships_followers) {
        const extracted = followersData.relationships_followers.flatMap(item =>
          item.string_list_data.map(user => user.value)
        );
        console.log(`Extracted ${extracted.length} followers`);
        return extracted;
      }
    } else {
      const followingData = data as FollowingData;
      console.log('Following data structure:', followingData);
      if (followingData.relationships_following) {
        const extracted = followingData.relationships_following.flatMap(item =>
          item.string_list_data.map(user => user.value)
        );
        console.log(`Extracted ${extracted.length} following`);
        return extracted;
      }
    }
    
    // Fallback for other JSON structures
    console.log('Trying fallback parsing for', type);
    if (Array.isArray(data)) {
      const extracted = data.map(item => 
        typeof item === 'string' ? item : 
        item.username || item.value || item.name || String(item)
      );
      console.log(`Fallback extracted ${extracted.length} ${type}`);
      return extracted;
    }
    
    console.log(`No ${type} data found in JSON structure`);
    return [];
  } catch (error) {
    console.error(`Error parsing JSON for ${type}:`, error);
    throw new Error(`Invalid JSON format for ${type}: ${error.message}`);
  }
};

export const parseHTMLData = (content: string): string[] => {
  try {
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    // Look for common Instagram HTML patterns
    const usernames: string[] = [];
    
    // Try different selectors that Instagram might use
    const selectors = [
      'a[href*="instagram.com/"]',
      '.user-link',
      '[data-username]',
      'a[href*="/"]'
    ];
    
    for (const selector of selectors) {
      const elements = tempDiv.querySelectorAll(selector);
      elements.forEach(element => {
        const href = element.getAttribute('href');
        const username = element.getAttribute('data-username') || 
                        element.textContent?.trim();
        
        if (href) {
          // Extract username from Instagram URL
          const match = href.match(/instagram\.com\/([^/?]+)/);
          if (match && match[1]) {
            usernames.push(match[1]);
          }
        } else if (username && username !== '') {
          usernames.push(username);
        }
      });
      
      if (usernames.length > 0) break;
    }
    
    // Remove duplicates and filter out invalid usernames
    return [...new Set(usernames)].filter(username => 
      username && 
      username.length > 0 && 
      !username.includes(' ') &&
      username !== 'instagram.com'
    );
  } catch (error) {
    console.error('Error parsing HTML:', error);
    throw new Error('Invalid HTML format');
  }
};

export const parseTextData = (content: string): string[] => {
  if (!content.trim()) return [];
  
  // Split by common delimiters and clean up
  const usernames = content
    .split(/[\n,\s]+/)
    .map(username => username.trim().replace(/^@/, ''))
    .filter(username => username.length > 0);
  
  return [...new Set(usernames)];
};

export const processData = (followers: string[], following: string[]): ProcessedData => {
  const followersSet = new Set(followers);
  const followingSet = new Set(following);
  
  // Find people you follow who don't follow you back
  const notFollowingBack = following.filter(username => !followersSet.has(username));
  
  // Find mutual followers (people who follow you and you follow them)
  const mutualFollowers = followers.filter(username => followingSet.has(username));
  
  return {
    followers,
    following,
    notFollowingBack,
    mutualFollowers
  };
};

export const exportResults = (data: ProcessedData): void => {
  const results = {
    generated_at: new Date().toISOString(),
    summary: {
      total_followers: data.followers.length,
      total_following: data.following.length,
      not_following_back_count: data.notFollowingBack.length,
      mutual_followers_count: data.mutualFollowers.length,
      follow_ratio: data.following.length > 0 ? (data.followers.length / data.following.length * 100).toFixed(2) + '%' : '0%'
    },
    not_following_back: data.notFollowingBack,
    mutual_followers: data.mutualFollowers
  };
  
  const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `instagram-analysis-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};