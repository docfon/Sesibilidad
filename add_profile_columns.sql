-- =====================================================
-- Add dentist profile columns: full_name, profession
-- =====================================================
-- These columns allow dentists (and any user) to store
-- their name and professional specialty.
-- =====================================================

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS profession text;
