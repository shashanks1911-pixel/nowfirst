import test from 'node:test';
import assert from 'node:assert/strict';
import { store } from './store.ts';

test('Board initialization and independence with Weekly Rounds', () => {
  store.resetDemo();
  const comp = store.getBoard('companies');
  const soc = store.getBoard('social');

  // Verify initial round and leaders
  assert.equal(comp.currentRound.roundNumber, 14);
  assert.equal(comp.lastActivatedAmountPaise, 15000); // ₹150
  assert.equal(soc.lastActivatedAmountPaise, 14000);  // ₹140

  // Min required to take over
  assert.equal(store.getMinRequiredAmountPaise('companies'), 15100); // ₹151
  assert.equal(store.getMinRequiredAmountPaise('social'), 14100);    // ₹141
});

test('Advancing weekly round resets spotlight price floor to base ₹100', () => {
  store.resetDemo();
  const initialRound = store.getBoard('companies').currentRound.roundNumber;

  // Advance weekly round
  const newRound = store.advanceWeeklyRound('companies');
  assert.equal(newRound.roundNumber, initialRound + 1);

  // Price floor is reset to base ₹100 (10000 paise) so future advertisers are never priced out!
  const updatedComp = store.getBoard('companies');
  assert.equal(updatedComp.lastActivatedAmountPaise, 0);
  assert.equal(store.getMinRequiredAmountPaise('companies'), 10000); // Back to base ₹100!
});

test('Spotlight displacement: brand maintains active listing in Curated Directory & Digest', () => {
  store.resetDemo();
  const initialComp = store.getBoard('companies');
  const oldLeaderId = initialComp.currentPlacement.id;
  const initialActiveCampaignsCount = initialComp.activeCampaigns.length;

  // Create an approved developer tool
  const newAd = store.createAdCreative({
    advertiserId: 'adv_delhi_dev',
    advertiserName: 'Pulse Infra',
    advertiserEmail: 'ceo@pulseinfra.in',
    board: 'companies',
    title: 'Pulse MicroVM Cloud',
    tagline: 'Firecracker MicroVMs provisioned in under 150ms on Delhi and Bengaluru datacenters.',
    destinationUrl: 'https://pulseinfra.in',
    displayDomain: 'pulseinfra.in',
    category: 'Developer Tools',
    targetAudience: 'Indian DevOps & Cloud Engineers',
    objective: 'trial_signups',
    founderPerk: {
      title: '₹15,000 Free MicroVM Credits',
      description: 'Exclusive 3-month credit for Indian engineering teams.',
      promoCode: 'PULSE_FOUNDER',
    },
    mediaUrl: 'https://example.com/pulse.png',
    ownershipAttested: true,
    moderationStatus: 'approved',
  });

  // Take over with ₹200
  const result = store.executeTakeover({
    board: 'companies',
    adCreativeId: newAd.id,
    amountPaise: 20000,
    advertiserId: newAd.advertiserId,
    advertiserName: newAd.advertiserName,
    advertiserEmail: newAd.advertiserEmail,
  });

  assert.equal(result.success, true);
  assert.equal(result.code, 'ACTIVATED');

  const updatedComp = store.getBoard('companies');
  // New leader is Pulse MicroVM Cloud
  assert.equal(updatedComp.currentPlacement.advertiserName, 'Pulse Infra');

  // KEY CRITICAL RULE VERIFICATION:
  // The displaced leader (Apex Studio India) STILL EXISTS in activeCampaigns (7-day directory)!
  const oldLeaderStillActive = updatedComp.activeCampaigns.find((c) => c.id === oldLeaderId);
  assert.ok(oldLeaderStillActive, 'Old leader must remain active in directory listing');
  assert.equal(oldLeaderStillActive.status, 'campaign_active');
  assert.equal(oldLeaderStillActive.isLive, false);
});

test('Conversion tracking and attribution calculation', () => {
  store.resetDemo();
  const comp = store.getBoard('companies');
  const livePlacementId = comp.currentPlacement.id;
  const initialConversions = comp.currentPlacement.conversionsCount;

  // Record a trial signup conversion
  const recorded = store.recordConversion(livePlacementId, 'trial_signups');
  assert.equal(recorded, true);

  const updated = store.getBoard('companies').currentPlacement;
  assert.equal(updated.conversionsCount, initialConversions + 1);
});

test('Saved Tools (Bookmarks) and Weekly Digest Subscription', () => {
  store.resetDemo();
  assert.equal(store.isToolSaved('tool_123'), false);

  // Toggle save
  const saved = store.toggleSaveTool('tool_123');
  assert.equal(saved, true);
  assert.equal(store.isToolSaved('tool_123'), true);

  // Subscribe to digest
  const subscribed = store.subscribeToDigest('founder@startup.in');
  assert.equal(subscribed, true);
  assert.equal(store.subscribeToDigest('invalid-email'), false);
});
