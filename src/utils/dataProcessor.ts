import { FollowersData, FollowingData, ProcessedData } from '@/types/instagram';

// Normalize usernames to a consistent, comparable handle
const normalizeUsername = (raw: string | undefined | null): string => {
  if (!raw) return '';
  let u = raw.trim();
  // Strip URLs and protocols
  u = u.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '');
  u = u.replace(/^instagram\.com\//i, '');
  // Remove query/paths and trailing slashes
  u = u.split('?')[0].split('/')[0];
  // Strip leading @
  u = u.replace(/^@/, '');
  // Lowercase
  u = u.toLowerCase();
  // Keep only valid instagram handle chars (letters, numbers, dot, underscore)
  u = u.replace(/[^a-z0-9._]/g, '');
  return u;
};

export const parseJSONData = (content: string, type: 'followers' | 'following'): string[] => {
  try {
    console.log(`Parsing ${type} data, content length:`, content.length);
    const data = JSON.parse(content);
    console.log(`Parsed ${type} data structure:`, data);
    
    if (type === 'followers') {
      const followersData = data as FollowersData;
      console.log('Followers data structure:', followersData);
      if (followersData.relationships_followers) {
        // Get current followers by finding the most recent timestamp for each user
        const userMap = new Map<string, number>();
        
        followersData.relationships_followers.forEach(item => {
          item.string_list_data.forEach(user => {
            const handle = normalizeUsername(user.value);
            if (!handle) return;
            const existingTimestamp = userMap.get(handle);
            if (!existingTimestamp || user.timestamp > existingTimestamp) {
              userMap.set(handle, user.timestamp);
            }
          });
        });
        
        const extracted = Array.from(userMap.keys());
        console.log(`Extracted ${extracted.length} current followers`);
        return extracted;
      }
    } else {
      const followingData = data as FollowingData;
      console.log('Following data structure:', followingData);
      if (followingData.relationships_following) {
        // Get current following by finding the most recent timestamp for each user
        const userMap = new Map<string, number>();
        
        followingData.relationships_following.forEach(item => {
          item.string_list_data.forEach(user => {
            const handle = normalizeUsername(user.value);
            if (!handle) return;
            const existingTimestamp = userMap.get(handle);
            if (!existingTimestamp || user.timestamp > existingTimestamp) {
              userMap.set(handle, user.timestamp);
            }
          });
        });
        
        const extracted = Array.from(userMap.keys());
        console.log(`Extracted ${extracted.length} current following`);
        return extracted;
      }
    }
    
    // Fallback for other JSON structures
    console.log('Trying fallback parsing for', type);
    if (Array.isArray(data)) {
      const extracted = data
        .map(item => (typeof item === 'string'
          ? item
          : item.username || item.value || item.name || String(item)))
        .map(normalizeUsername)
        .filter(u => u);
      console.log(`Fallback extracted ${extracted.length} ${type}`);
      return Array.from(new Set(extracted));
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

    // Collect potential usernames
    const usernames: string[] = [];

    // Try different selectors that Instagram might use
    const selectors = [
      'a[href*="instagram.com/"]',
      '[data-username]',
      '.user-link',
      'a[href^="/"]',
      'a'
    ];

    for (const selector of selectors) {
      const elements = tempDiv.querySelectorAll(selector);
      elements.forEach(el => {
        const href = el.getAttribute('href') || '';
        const dataUsername = el.getAttribute('data-username') || '';
        const text = el.textContent?.trim() || '';

        const fromHref = normalizeUsername(href);
        const fromData = normalizeUsername(dataUsername);
        const fromText = normalizeUsername(text);

        if (fromHref) usernames.push(fromHref);
        else if (fromData) usernames.push(fromData);
        else if (fromText) usernames.push(fromText);
      });

      if (usernames.length > 0) break;
    }

    // Remove duplicates and filter out invalid usernames
    return Array.from(new Set(usernames)).filter(u => u && u !== 'instagram.com');
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
    .map(normalizeUsername)
    .filter(u => u);
  return Array.from(new Set(usernames));
};

export const processData = (followers: string[], following: string[]): ProcessedData => {
  // Normalize everything defensively
  const followersNorm = followers.map(normalizeUsername).filter(u => u);
  const followingNorm = following.map(normalizeUsername).filter(u => u);

  const followersSet = new Set(followersNorm);

  // People you follow who don't follow you back (today)
  const notFollowingBack = followingNorm.filter(u => !followersSet.has(u));

  console.log(`Processing (normalized): ${followersNorm.length} followers, ${followingNorm.length} following`);
  if (followingNorm.length === notFollowingBack.length && followersNorm.length > 0) {
    console.warn('All following flagged as not following back. Likely normalization mismatch in inputs. Sample:', {
      sampleFollowing: followingNorm.slice(0, 5),
      sampleFollowers: followersNorm.slice(0, 5),
    });
  }
  console.log(`Found ${notFollowingBack.length} users not following back:`, notFollowingBack);

  return {
    followers: followersNorm,
    following: followingNorm,
    notFollowingBack,
    mutualFollowers: [] // Not needed anymore
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