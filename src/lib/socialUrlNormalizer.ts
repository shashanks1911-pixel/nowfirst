import type { SocialPlatform } from '../types/index.ts';

export interface NormalizedSocialResult {
  isValid: boolean;
  platform?: SocialPlatform;
  normalizedUrl?: string;
  handleOrIdentifier?: string;
  identityLabel?: string;
  errorMessage?: string;
}

const INSTAGRAM_REJECTED = /^\/(p|reel|reels|stories|explore|direct|tv|accounts|share)\b/i;
const INSTAGRAM_HANDLE_REGEX = /^[a-zA-Z0-9._]{1,30}$/;

const X_REJECTED = /^\/(status|statuses|i|compose|home|explore|notifications|messages|search|settings|intent|share)\b/i;
const X_HANDLE_REGEX = /^[a-zA-Z0-9_]{1,15}$/;

const FB_REJECTED = /^\/(posts|groups|watch|events|photo|photos|story\.php|permalink\.php|media|share|sharer)\b/i;
const FB_VANITY_REGEX = /^[a-zA-Z0-9.]{3,50}$/;

const LINKEDIN_SLUG_REGEX = /^[a-zA-Z0-9\-_%]{1,100}$/;

/**
 * Validates and strictly normalizes social profile URLs.
 * Handles HTTPS enforcement, credential rejection, legacy Twitter normalization,
 * Facebook numeric ID preservation, tracking query removal, and invalid route rejection.
 */
export function validateAndNormalizeSocialUrl(
  rawInput: string,
  selectedPlatform?: SocialPlatform
): NormalizedSocialResult {
  if (!rawInput || typeof rawInput !== 'string') {
    return { isValid: false, errorMessage: 'URL cannot be empty.' };
  }

  const trimmed = rawInput.trim();
  let parsed: URL;

  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    parsed = new URL(withProtocol);
  } catch {
    return { isValid: false, errorMessage: 'Invalid URL format. Please enter a valid web address.' };
  }

  // Reject insecure HTTP or unexpected protocols
  if (parsed.protocol !== 'https:') {
    return { isValid: false, errorMessage: 'HTTPS is required for all profile links for security.' };
  }

  // Reject embedded credentials (e.g. https://user:pass@example.com)
  if (parsed.username || parsed.password) {
    return { isValid: false, errorMessage: 'URLs containing embedded credentials are not permitted.' };
  }

  const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');
  const pathname = parsed.pathname;

  // 1. INSTAGRAM
  if (hostname === 'instagram.com') {
    if (selectedPlatform && selectedPlatform !== 'instagram') {
      return { isValid: false, errorMessage: `This is an Instagram URL, but you selected ${selectedPlatform.toUpperCase()}.` };
    }

    if (INSTAGRAM_REJECTED.test(pathname) || pathname.includes('/p/') || pathname.includes('/reel/') || pathname.includes('/stories/')) {
      return {
        isValid: false,
        errorMessage: 'Instagram posts, reels, stories, or explore links are not accepted. Please supply a direct profile URL.',
      };
    }

    const segments = pathname.split('/').filter(Boolean);
    if (segments.length !== 1) {
      return { isValid: false, errorMessage: 'Provide a direct Instagram profile URL (e.g. https://instagram.com/username).' };
    }

    const username = segments[0];
    if (INSTAGRAM_REJECTED.test(`/${username}`) || !INSTAGRAM_HANDLE_REGEX.test(username) || username.startsWith('.') || username.endsWith('.')) {
      return { isValid: false, errorMessage: 'Invalid Instagram username or unsupported route.' };
    }

    const cleanUsername = username.toLowerCase();
    return {
      isValid: true,
      platform: 'instagram',
      normalizedUrl: `https://instagram.com/${cleanUsername}/`,
      handleOrIdentifier: `@${cleanUsername}`,
      identityLabel: `@${cleanUsername}`,
    };
  }

  // 2. X / TWITTER
  if (hostname === 'x.com' || hostname === 'twitter.com') {
    if (selectedPlatform && selectedPlatform !== 'x') {
      return { isValid: false, errorMessage: `This is an X/Twitter URL, but you selected ${selectedPlatform.toUpperCase()}.` };
    }

    if (X_REJECTED.test(pathname) || pathname.includes('/status/') || pathname.includes('/statuses/')) {
      return {
        isValid: false,
        errorMessage: 'Individual tweets, posts, or compose links are not accepted. Please provide an X profile link.',
      };
    }

    const segments = pathname.split('/').filter(Boolean);
    if (segments.length !== 1) {
      return { isValid: false, errorMessage: 'Provide a direct X profile URL (e.g. https://x.com/handle).' };
    }

    const handle = segments[0];
    if (X_REJECTED.test(`/${handle}`) || !X_HANDLE_REGEX.test(handle)) {
      return { isValid: false, errorMessage: 'Invalid X handle or unsupported internal route.' };
    }

    const cleanHandle = handle.toLowerCase();
    // Normalize twitter.com -> x.com
    return {
      isValid: true,
      platform: 'x',
      normalizedUrl: `https://x.com/${cleanHandle}`,
      handleOrIdentifier: `@${cleanHandle}`,
      identityLabel: `@${cleanHandle}`,
    };
  }

  // 3. FACEBOOK
  if (hostname === 'facebook.com' || hostname === 'fb.com' || hostname === 'm.facebook.com') {
    if (selectedPlatform && selectedPlatform !== 'facebook') {
      return { isValid: false, errorMessage: `This is a Facebook URL, but you selected ${selectedPlatform.toUpperCase()}.` };
    }

    if (FB_REJECTED.test(pathname)) {
      return {
        isValid: false,
        errorMessage: 'Facebook posts, groups, events, or media links are not accepted. Please supply a Page or profile URL.',
      };
    }

    // Support numeric profile: facebook.com/profile.php?id=123456
    if (pathname.toLowerCase() === '/profile.php') {
      const id = parsed.searchParams.get('id');
      if (id && /^\d+$/.test(id)) {
        return {
          isValid: true,
          platform: 'facebook',
          normalizedUrl: `https://facebook.com/profile.php?id=${id}`,
          handleOrIdentifier: `ID: ${id}`,
          identityLabel: `Profile (ID: ${id})`,
        };
      }
      return { isValid: false, errorMessage: 'Missing or invalid numeric Facebook ID in profile.php link.' };
    }

    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 1) {
      const vanity = segments[0];
      if (!FB_VANITY_REGEX.test(vanity)) {
        return { isValid: false, errorMessage: 'Invalid Facebook page or profile slug.' };
      }
      return {
        isValid: true,
        platform: 'facebook',
        normalizedUrl: `https://facebook.com/${vanity}`,
        handleOrIdentifier: vanity,
        identityLabel: vanity,
      };
    }

    return { isValid: false, errorMessage: 'Provide a valid Facebook Page or profile link.' };
  }

  // 4. LINKEDIN
  if (hostname === 'linkedin.com' || hostname === 'in.linkedin.com') {
    if (selectedPlatform && selectedPlatform !== 'linkedin') {
      return { isValid: false, errorMessage: `This is a LinkedIn URL, but you selected ${selectedPlatform.toUpperCase()}.` };
    }

    const segments = pathname.split('/').filter(Boolean);
    if (segments.length >= 2 && (segments[0] === 'in' || segments[0] === 'company')) {
      const type = segments[0] as 'in' | 'company';
      const slug = segments[1];

      if (!LINKEDIN_SLUG_REGEX.test(slug)) {
        return { isValid: false, errorMessage: 'Invalid LinkedIn identifier format.' };
      }

      const isCompany = type === 'company';
      return {
        isValid: true,
        platform: 'linkedin',
        normalizedUrl: `https://www.linkedin.com/${type}/${slug}/`,
        handleOrIdentifier: isCompany ? `${slug} (Company)` : slug,
        identityLabel: isCompany ? `${slug} (Company Page)` : `${slug} (Profile)`,
      };
    }

    return {
      isValid: false,
      errorMessage: 'Only LinkedIn personal profiles (/in/slug) or company Pages (/company/slug) are supported.',
    };
  }

  return {
    isValid: false,
    errorMessage: `Unrecognized or unsupported platform domain (${hostname}). We support Instagram, X, Facebook, and LinkedIn.`,
  };
}

/**
 * Validates company destination URL (must be a genuine company/product website, not social media)
 */
export function validateCompanyWebsiteUrl(rawInput: string): {
  isValid: boolean;
  normalizedUrl?: string;
  domain?: string;
  errorMessage?: string;
} {
  if (!rawInput || typeof rawInput !== 'string') {
    return { isValid: false, errorMessage: 'Website URL cannot be empty.' };
  }

  const trimmed = rawInput.trim();
  let parsed: URL;

  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    parsed = new URL(withProtocol);
  } catch {
    return { isValid: false, errorMessage: 'Invalid website URL format.' };
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return { isValid: false, errorMessage: 'Valid HTTP or HTTPS web URL required.' };
  }

  if (parsed.username || parsed.password) {
    return { isValid: false, errorMessage: 'URLs with credentials are not permitted.' };
  }

  const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');
  if (!hostname || !hostname.includes('.')) {
    return { isValid: false, errorMessage: 'Please enter a complete domain name (e.g. yourcompany.com).' };
  }

  // Prevent posting social profile as company website
  const prohibitedSocialHosts = ['instagram.com', 'x.com', 'twitter.com', 'facebook.com', 'linkedin.com', 'tiktok.com'];
  if (prohibitedSocialHosts.some((h) => hostname === h || hostname.endsWith(`.${h}`))) {
    return {
      isValid: false,
      errorMessage: 'Company placements must lead to a company or product website, not a social media profile. Please use the Social board for social profiles.',
    };
  }

  return {
    isValid: true,
    normalizedUrl: parsed.toString(),
    domain: hostname,
  };
}
