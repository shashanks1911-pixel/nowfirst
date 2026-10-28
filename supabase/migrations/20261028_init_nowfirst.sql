-- NowFirst Supabase PostgreSQL Schema & Security Policies
-- Connected Test Mode & Production Migration

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Custom Types
DO $$ BEGIN
  CREATE TYPE board_type AS ENUM ('companies', 'social');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE ad_status AS ENUM ('draft', 'pending_review', 'approved', 'rejected', 'suspended');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE placement_status AS ENUM ('active', 'outbid', 'moderation_removed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM (
    'created',
    'authorized',
    'captured',
    'activation_succeeded',
    'activation_failed_refund_pending',
    'refund_pending',
    'refunded',
    'refund_attention_required',
    'failed'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. Boards Table: Single Source of Truth for Live Leaders
CREATE TABLE IF NOT EXISTS public.boards (
  id board_type PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  min_initial_amount_paise BIGINT NOT NULL DEFAULT 10000, -- ₹100.00 in paise
  min_increment_paise BIGINT NOT NULL DEFAULT 100,        -- ₹1.00 in paise
  last_activated_amount_paise BIGINT NOT NULL DEFAULT 0,
  current_placement_id UUID,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Advertisers Profile (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.advertisers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  role VARCHAR(50) NOT NULL DEFAULT 'advertiser',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Ads Master Table
CREATE TABLE IF NOT EXISTS public.ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id UUID NOT NULL REFERENCES public.advertisers(id) ON DELETE CASCADE,
  board board_type NOT NULL,
  status ad_status NOT NULL DEFAULT 'draft',
  revision_number INT NOT NULL DEFAULT 1,
  moderator_feedback TEXT,
  evidence_requested BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Ad Revisions (Immutable snapshots for moderation and historical consistency)
CREATE TABLE IF NOT EXISTS public.ad_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id UUID NOT NULL REFERENCES public.ads(id) ON DELETE CASCADE,
  revision_number INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  tagline TEXT NOT NULL,
  destination_url TEXT NOT NULL,
  media_url TEXT NOT NULL,
  company_category VARCHAR(100),
  destination_domain VARCHAR(255),
  social_platform VARCHAR(50),
  social_handle VARCHAR(100),
  ownership_attested BOOLEAN NOT NULL DEFAULT false,
  status ad_status NOT NULL DEFAULT 'pending_review',
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (ad_id, revision_number)
);

-- 5. Payments (Razorpay Integration)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(100) NOT NULL UNIQUE,
  payment_id VARCHAR(100) UNIQUE,
  advertiser_id UUID NOT NULL REFERENCES public.advertisers(id),
  ad_revision_id UUID NOT NULL REFERENCES public.ad_revisions(id),
  board board_type NOT NULL,
  amount_paise BIGINT NOT NULL CHECK (amount_paise > 0),
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  status payment_status NOT NULL DEFAULT 'created',
  gateway_signature TEXT,
  failure_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Placements (Live Spotlight & Historical Billboard)
CREATE TABLE IF NOT EXISTS public.placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board board_type NOT NULL,
  ad_revision_id UUID NOT NULL REFERENCES public.ad_revisions(id),
  payment_id UUID NOT NULL UNIQUE REFERENCES public.payments(id),
  advertiser_id UUID NOT NULL REFERENCES public.advertisers(id),
  amount_paise BIGINT NOT NULL CHECK (amount_paise > 0),
  status placement_status NOT NULL DEFAULT 'active',
  is_live BOOLEAN NOT NULL DEFAULT true,
  activated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  ended_at TIMESTAMPTZ,
  clicks_count INT NOT NULL DEFAULT 0,
  spotlight_clicks_count INT NOT NULL DEFAULT 0,
  history_clicks_count INT NOT NULL DEFAULT 0
);

-- CRITICAL DATABASE LEVEL CONSTRAINT: Exactly at most ONE live placement per board
CREATE UNIQUE INDEX IF NOT EXISTS idx_single_live_placement_per_board
  ON public.placements (board)
  WHERE (is_live = true AND status = 'active');

-- Add circular foreign key to boards safely
DO $$ BEGIN
  ALTER TABLE public.boards
    ADD CONSTRAINT fk_boards_current_placement
    FOREIGN KEY (current_placement_id) REFERENCES public.placements(id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 7. Durable Refund Jobs Queue
CREATE TABLE IF NOT EXISTS public.refund_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  razorpay_payment_id VARCHAR(100) NOT NULL,
  amount_paise BIGINT NOT NULL CHECK (amount_paise > 0),
  reason VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  attempts INT NOT NULL DEFAULT 0,
  max_attempts INT NOT NULL DEFAULT 5,
  last_error TEXT,
  gateway_refund_id VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Outbound Clicks Telemetry
CREATE TABLE IF NOT EXISTS public.outbound_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  placement_id UUID NOT NULL REFERENCES public.placements(id) ON DELETE CASCADE,
  board board_type NOT NULL,
  is_spotlight BOOLEAN NOT NULL,
  platform VARCHAR(50),
  ip_hash VARCHAR(64) NOT NULL,
  user_agent TEXT,
  is_valid BOOLEAN NOT NULL DEFAULT true,
  filter_reason VARCHAR(50) NOT NULL DEFAULT 'none',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Immutable Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(100) NOT NULL,
  actor VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100) NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Row Level Security (RLS)
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertisers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refund_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outbound_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public read on boards and active/outbid placements
CREATE POLICY "Public read boards" ON public.boards FOR SELECT USING (true);
CREATE POLICY "Public read placements" ON public.placements FOR SELECT USING (status IN ('active', 'outbid'));
CREATE POLICY "Public read approved revisions" ON public.ad_revisions FOR SELECT USING (status = 'approved');

-- Advertisers read and write their own records
CREATE POLICY "Advertisers read own profile" ON public.advertisers FOR SELECT USING (id = auth.uid());
CREATE POLICY "Advertisers manage own ads" ON public.ads FOR ALL USING (advertiser_id = auth.uid());
CREATE POLICY "Advertisers manage own revisions" ON public.ad_revisions FOR ALL USING (
  ad_id IN (SELECT id FROM public.ads WHERE advertiser_id = auth.uid())
);
CREATE POLICY "Advertisers read own payments" ON public.payments FOR SELECT USING (advertiser_id = auth.uid());
CREATE POLICY "Advertisers read own refund jobs" ON public.refund_jobs FOR SELECT USING (
  payment_id IN (SELECT id FROM public.payments WHERE advertiser_id = auth.uid())
);

-- Clicks insertion allowed for telemetry
CREATE POLICY "Public insert clicks" ON public.outbound_clicks FOR INSERT WITH CHECK (true);

-- Atomic SQL Function for Placement Activation & Concurrency Lock
CREATE OR REPLACE FUNCTION public.activate_board_placement(
  p_order_id VARCHAR(100),
  p_razorpay_payment_id VARCHAR(100),
  p_razorpay_signature TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_payment RECORD;
  v_board RECORD;
  v_current_leader RECORD;
  v_min_required_paise BIGINT;
  v_new_placement_id UUID;
BEGIN
  -- 1. Lock payment record
  SELECT * INTO v_payment FROM public.payments WHERE order_id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'PAYMENT_NOT_FOUND');
  END IF;

  IF v_payment.status IN ('activation_succeeded', 'refunded', 'activation_failed_refund_pending') THEN
    RETURN jsonb_build_object('success', true, 'message', 'ALREADY_PROCESSED');
  END IF;

  -- 2. ACQUIRE EXCLUSIVE ROW LOCK ON THE TARGET BOARD
  -- This serializes all activation attempts for this specific board
  SELECT * INTO v_board FROM public.boards WHERE id = v_payment.board FOR UPDATE;

  IF v_board.last_activated_amount_paise = 0 THEN
    v_min_required_paise := v_board.min_initial_amount_paise;
  ELSE
    v_min_required_paise := v_board.last_activated_amount_paise + v_board.min_increment_paise;
  END IF;

  -- 3. Check Anti-Self-Challenge
  IF v_board.current_placement_id IS NOT NULL THEN
    SELECT * INTO v_current_leader FROM public.placements WHERE id = v_board.current_placement_id;
    IF v_current_leader.advertiser_id = v_payment.advertiser_id THEN
      -- Cannot challenge own ad -> automatic refund
      UPDATE public.payments SET status = 'activation_failed_refund_pending' WHERE id = v_payment.id;
      INSERT INTO public.refund_jobs (payment_id, razorpay_payment_id, amount_paise, reason, status)
      VALUES (v_payment.id, p_razorpay_payment_id, v_payment.amount_paise, 'self_challenge_rejected', 'pending');
      
      RETURN jsonb_build_object('success', false, 'code', 'SELF_CHALLENGE_REJECTED', 'message', 'Cannot outbid your own active placement. Full refund initiated.');
    END IF;
  END IF;

  -- 4. Check Price Eligibility / Race Condition
  IF v_payment.amount_paise < v_min_required_paise THEN
    -- Bid was out-raced by a higher payment that activated first
    UPDATE public.payments SET status = 'activation_failed_refund_pending' WHERE id = v_payment.id;
    INSERT INTO public.refund_jobs (payment_id, razorpay_payment_id, amount_paise, reason, status)
    VALUES (v_payment.id, p_razorpay_payment_id, v_payment.amount_paise, 'outbid_race_condition', 'pending');

    RETURN jsonb_build_object('success', false, 'code', 'OUTBID_RACE_CONDITION', 'message', 'Price increased before confirmation. Full refund initiated.');
  END IF;

  -- 5. Successful Activation
  -- Demote previous live placement to history
  IF v_board.current_placement_id IS NOT NULL THEN
    UPDATE public.placements
    SET is_live = false, status = 'outbid', ended_at = timezone('utc'::text, now())
    WHERE id = v_board.current_placement_id;
  END IF;

  -- Insert new live placement
  v_new_placement_id := gen_random_uuid();
  INSERT INTO public.placements (
    id, board, ad_revision_id, payment_id, advertiser_id, amount_paise, status, is_live, activated_at
  ) VALUES (
    v_new_placement_id, v_payment.board, v_payment.ad_revision_id, v_payment.id, v_payment.advertiser_id, v_payment.amount_paise, 'active', true, timezone('utc'::text, now())
  );

  -- Update board pointer and price
  UPDATE public.boards
  SET current_placement_id = v_new_placement_id, last_activated_amount_paise = v_payment.amount_paise, updated_at = timezone('utc'::text, now())
  WHERE id = v_payment.board;

  -- Mark payment captured and succeeded
  UPDATE public.payments
  SET status = 'activation_succeeded', payment_id = p_razorpay_payment_id, gateway_signature = p_razorpay_signature, updated_at = timezone('utc'::text, now())
  WHERE id = v_payment.id;

  RETURN jsonb_build_object('success', true, 'placement_id', v_new_placement_id, 'amount_paise', v_payment.amount_paise);
END;
$$;

