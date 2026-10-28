import test from 'node:test';
import assert from 'node:assert/strict';
import { validateAndNormalizeSocialUrl, validateCompanyWebsiteUrl } from './socialUrlNormalizer.ts';

test('Instagram validation', () => {
  // Valid Instagram profile
  const valid = validateAndNormalizeSocialUrl('https://instagram.com/antigravity.ai');
  assert.equal(valid.isValid, true);
  assert.equal(valid.platform, 'instagram');
  assert.equal(valid.normalizedUrl, 'https://instagram.com/antigravity.ai/');
  assert.equal(valid.handleOrIdentifier, '@antigravity.ai');

  // Reject Instagram post / reels / stories
  const post = validateAndNormalizeSocialUrl('https://instagram.com/p/C-12345abc/');
  assert.equal(post.isValid, false);
  assert.match(post.errorMessage, /posts, reels, stories/);

  const reel = validateAndNormalizeSocialUrl('https://instagram.com/reel/C-xyz789');
  assert.equal(reel.isValid, false);
});

test('X / Twitter normalization', () => {
  // Normalize twitter.com to x.com
  const twitter = validateAndNormalizeSocialUrl('https://twitter.com/nowfirst_app');
  assert.equal(twitter.isValid, true);
  assert.equal(twitter.platform, 'x');
  assert.equal(twitter.normalizedUrl, 'https://x.com/nowfirst_app');
  assert.equal(twitter.handleOrIdentifier, '@nowfirst_app');

  // Reject tweet / status
  const tweet = validateAndNormalizeSocialUrl('https://x.com/jack/status/20');
  assert.equal(tweet.isValid, false);
  assert.match(tweet.errorMessage, /Individual tweets/);
});

test('Facebook Page & numeric ID validation', () => {
  // Vanity page
  const page = validateAndNormalizeSocialUrl('https://facebook.com/apple');
  assert.equal(page.isValid, true);
  assert.equal(page.platform, 'facebook');
  assert.equal(page.normalizedUrl, 'https://facebook.com/apple');

  // Numeric profile ID preserved
  const numeric = validateAndNormalizeSocialUrl('https://facebook.com/profile.php?id=100084729182741&sk=about&ref=bookmarks');
  assert.equal(numeric.isValid, true);
  assert.equal(numeric.platform, 'facebook');
  assert.equal(numeric.normalizedUrl, 'https://facebook.com/profile.php?id=100084729182741');

  // Reject groups and posts
  const group = validateAndNormalizeSocialUrl('https://facebook.com/groups/techstartup');
  assert.equal(group.isValid, false);
});

test('LinkedIn Profile & Company Page validation', () => {
  // Personal profile
  const profile = validateAndNormalizeSocialUrl('https://www.linkedin.com/in/satyanadella?tracking=xyz');
  assert.equal(profile.isValid, true);
  assert.equal(profile.platform, 'linkedin');
  assert.equal(profile.normalizedUrl, 'https://www.linkedin.com/in/satyanadella/');

  // Company page
  const company = validateAndNormalizeSocialUrl('https://linkedin.com/company/google/');
  assert.equal(company.isValid, true);
  assert.equal(company.platform, 'linkedin');
  assert.equal(company.normalizedUrl, 'https://www.linkedin.com/company/google/');

  // Reject feed/jobs
  const jobs = validateAndNormalizeSocialUrl('https://linkedin.com/jobs/view/123456');
  assert.equal(jobs.isValid, false);
});

test('Company website URL validation', () => {
  const valid = validateCompanyWebsiteUrl('https://stripe.com');
  assert.equal(valid.isValid, true);
  assert.equal(valid.domain, 'stripe.com');

  // Reject social media link on company board
  const social = validateCompanyWebsiteUrl('https://x.com/stripe');
  assert.equal(social.isValid, false);
  assert.match(social.errorMessage, /Social board/);
});

