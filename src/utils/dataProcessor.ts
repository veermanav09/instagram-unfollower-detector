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

    // Helper: add handle with the most recent timestamp
    const userMap = new Map<string, number>();
    const addHandle = (raw: string | undefined | null, ts?: number) => {
      const handle = normalizeUsername(raw || '');
      if (!handle) return;
      const existing = userMap.get(handle) ?? -Infinity;
      const time = typeof ts === 'number' ? ts : -Infinity;
      if (time >= existing) userMap.set(handle, time);
    };

    // Extractors that work across known and slightly different JSON variants
    const extractFromStringListItem = (item: any) => {
      if (!item) return;
      const href = item.href as string | undefined;
      const value = item.value as string | undefined;
      const ts = item.timestamp as number | undefined;
      // Prefer href then value
      addHandle(href || value, ts);
    };

    const extractFromContainer = (container: any[] | undefined) => {
      if (!Array.isArray(container)) return;
      container.forEach(rec => {
        // Typical shape: { string_list_data: [ { href, value, timestamp } ] }
        if (rec && Array.isArray((rec as any).string_list_data)) {
          (rec as any).string_list_data.forEach(extractFromStringListItem);
        } else if (rec) {
          // Sometimes items are direct objects with href/value/username
          const href = (rec as any).href as string | undefined;
          const value = (rec as any).value as string | undefined;
          const username = (rec as any).username as string | undefined;
          const ts = (rec as any).timestamp as number | undefined;
          addHandle(href || username || value, ts);
        }
      });
    };

    // 1) Handle canonical keys first
    if (type === 'followers') {
      const followersData = data as FollowersData;
      if (followersData.relationships_followers) {
        extractFromContainer(followersData.relationships_followers as any);
      }
    } else {
      const followingData = data as FollowingData;
      if (followingData.relationships_following) {
        extractFromContainer(followingData.relationships_following as any);
      }
    }

    // 2) If nothing found yet, try common alternatives and a light recursive scan
    const hasAny = userMap.size > 0;
    if (!hasAny) {
      // Some exports place arrays directly at top level or under different keys
      if (Array.isArray(data)) {
        extractFromContainer(data);
      } else if (data && typeof data === 'object') {
        // Look for any array-valued property that contains string_list_data records
        Object.values(data as Record<string, unknown>).forEach(val => {
          if (Array.isArray(val)) extractFromContainer(val as any[]);
        });
      }
    }

    const extracted = Array.from(userMap.keys());
    console.log(`Extracted ${extracted.length} current ${type}`);
    return extracted;
  } catch (error: any) {
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