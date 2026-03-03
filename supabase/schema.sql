-- Supabase Schema for Warning Tracker
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enseignes table
CREATE TABLE IF NOT EXISTS enseignes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stores table
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    enseigne_id UUID NOT NULL REFERENCES enseignes(id) ON DELETE CASCADE,
    yellow_count INTEGER DEFAULT 0,
    red_count INTEGER DEFAULT 0,
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, enseigne_id)
);

-- Warnings table
CREATE TABLE IF NOT EXISTS warnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('yellow', 'red')),
    comment TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT DEFAULT 'Admin'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stores_enseigne_id ON stores(enseigne_id);
CREATE INDEX IF NOT EXISTS idx_warnings_store_id ON warnings(store_id);
CREATE INDEX IF NOT EXISTS idx_warnings_type ON warnings(type);

-- Row Level Security (RLS) policies
ALTER TABLE enseignes ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE warnings ENABLE ROW LEVEL SECURITY;

-- Allow all access (for development)
CREATE POLICY "Allow all" ON enseignes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON stores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON warnings FOR ALL USING (true) WITH CHECK (true);

-- Function to update store counts and blocked status when warning is added
CREATE OR REPLACE FUNCTION update_store_on_warning()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.type = 'yellow' THEN
        UPDATE stores SET yellow_count = yellow_count + 1 WHERE id = NEW.store_id;
        -- If yellow_count becomes multiple of 3, add a red card automatically
        IF (SELECT yellow_count FROM stores WHERE id = NEW.store_id) % 3 = 0 THEN
            UPDATE stores SET red_count = red_count + 1 WHERE id = NEW.store_id;
            -- Insert automatic red warning (now deletable)
            INSERT INTO warnings (store_id, type, comment, created_by)
            VALUES (NEW.store_id, 'red', '3ème carte jaune - conversion automatique', 'Auto');
        END IF;
    ELSIF NEW.type = 'red' THEN
        UPDATE stores SET red_count = red_count + 1 WHERE id = NEW.store_id;
    END IF;
    
    -- Update blocked status
    UPDATE stores SET is_blocked = (red_count >= 1) WHERE id = NEW.store_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for adding warnings
DROP TRIGGER IF EXISTS trigger_warning_added ON warnings;
CREATE TRIGGER trigger_warning_added
    AFTER INSERT ON warnings
    FOR EACH ROW
    EXECUTE FUNCTION update_store_on_warning();

-- Function to update store counts when warning is deleted (allows deleting ALL warnings)
CREATE OR REPLACE FUNCTION update_store_on_warning_delete()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.type = 'yellow' THEN
        UPDATE stores SET yellow_count = GREATEST(0, yellow_count - 1) WHERE id = OLD.store_id;
    ELSIF OLD.type = 'red' THEN
        UPDATE stores SET red_count = GREATEST(0, red_count - 1) WHERE id = OLD.store_id;
    END IF;
    
    -- Recalculate blocked status
    UPDATE stores SET is_blocked = (red_count >= 1) WHERE id = OLD.store_id;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger for deleting warnings
DROP TRIGGER IF EXISTS trigger_warning_deleted ON warnings;
CREATE TRIGGER trigger_warning_deleted
    AFTER DELETE ON warnings
    FOR EACH ROW
    EXECUTE FUNCTION update_store_on_warning_delete();
