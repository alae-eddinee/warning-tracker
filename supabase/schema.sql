-- Simplified Warning Tracker Schema
-- Logic: Just count yellow and red cards independently, no blocking

-- Drop existing triggers
DROP TRIGGER IF EXISTS trigger_warning_added ON warnings;
DROP TRIGGER IF EXISTS trigger_warning_deleted ON warnings;

-- Function to handle warning additions
CREATE OR REPLACE FUNCTION handle_warning_added()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.type = 'yellow' THEN
        -- Just increment yellow count
        UPDATE stores 
        SET yellow_count = yellow_count + 1 
        WHERE id = NEW.store_id;
        
    ELSIF NEW.type = 'red' THEN
        -- Just increment red count (no blocking)
        UPDATE stores 
        SET red_count = red_count + 1
        WHERE id = NEW.store_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle warning deletions
CREATE OR REPLACE FUNCTION handle_warning_deleted()
RETURNS TRIGGER AS $$
DECLARE
    current_yellows INT;
    current_reds INT;
BEGIN
    -- Get current counts
    SELECT yellow_count, red_count 
    INTO current_yellows, current_reds
    FROM stores WHERE id = OLD.store_id;
    
    IF OLD.type = 'yellow' THEN
        -- Just decrement yellow count
        UPDATE stores 
        SET yellow_count = GREATEST(0, yellow_count - 1)
        WHERE id = OLD.store_id;
        
    ELSIF OLD.type = 'red' THEN
        -- Just decrement red count
        UPDATE stores 
        SET red_count = GREATEST(0, red_count - 1)
        WHERE id = OLD.store_id;
    END IF;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_warning_added
    AFTER INSERT ON warnings
    FOR EACH ROW
    EXECUTE FUNCTION handle_warning_added();

CREATE TRIGGER trigger_warning_deleted
    AFTER DELETE ON warnings
    FOR EACH ROW
    EXECUTE FUNCTION handle_warning_deleted();

-- Warning Images Table (for multiple images per warning)
CREATE TABLE IF NOT EXISTS warning_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    warning_id UUID REFERENCES warnings(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_warning_images_warning_id ON warning_images(warning_id);

-- Reset all stores (keep is_blocked false by default)
UPDATE stores SET yellow_count = 0, red_count = 0, is_blocked = false;

-- Delete all existing warnings
DELETE FROM warnings;

-- Verify counts are zero
SELECT id, name, yellow_count, red_count, is_blocked FROM stores LIMIT 5;
