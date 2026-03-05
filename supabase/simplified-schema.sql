-- Simplified Warning Tracker Schema
-- Logic: 3 yellows = blocked store, no auto-generated warning entries

-- Drop existing triggers
DROP TRIGGER IF EXISTS trigger_warning_added ON warnings;
DROP TRIGGER IF EXISTS trigger_warning_deleted ON warnings;

-- Function to handle warning additions
CREATE OR REPLACE FUNCTION handle_warning_added()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.type = 'yellow' THEN
        -- Increment yellow count
        UPDATE stores 
        SET yellow_count = yellow_count + 1 
        WHERE id = NEW.store_id;
        
        -- Check if 3 yellows reached - block store (no warning entry created)
        IF (SELECT yellow_count FROM stores WHERE id = NEW.store_id) >= 3 THEN
            UPDATE stores 
            SET red_count = 1, is_blocked = true 
            WHERE id = NEW.store_id;
        END IF;
        
    ELSIF NEW.type = 'red' THEN
        -- Red card blocks the store (only 1 allowed)
        UPDATE stores 
        SET red_count = 1, is_blocked = true 
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
    has_manual_red BOOLEAN;
BEGIN
    -- Get current counts
    SELECT yellow_count, red_count 
    INTO current_yellows, current_reds
    FROM stores WHERE id = OLD.store_id;
    
    -- Check if there's a manual red card warning in the table
    SELECT EXISTS(
        SELECT 1 FROM warnings 
        WHERE store_id = OLD.store_id AND type = 'red' AND id != OLD.id
    ) INTO has_manual_red;
    
    IF OLD.type = 'yellow' THEN
        current_yellows := GREATEST(0, current_yellows - 1);
        
        -- If we drop below 3 yellows and NO manual red card exists, unblock
        IF current_yellows < 3 AND NOT has_manual_red THEN
            UPDATE stores 
            SET yellow_count = current_yellows, 
                red_count = 0, 
                is_blocked = false 
            WHERE id = OLD.store_id;
        ELSE
            -- Keep blocked (either still 3+ yellows or has manual red)
            UPDATE stores 
            SET yellow_count = current_yellows 
            WHERE id = OLD.store_id;
        END IF;
        
    ELSIF OLD.type = 'red' THEN
        -- Red card removed
        current_reds := 0;
        
        -- Check if still blocked by 3 yellows
        IF current_yellows >= 3 THEN
            -- Still blocked by 3 yellows (auto red)
            UPDATE stores 
            SET red_count = 1, is_blocked = true 
            WHERE id = OLD.store_id;
        ELSE
            -- Unblocked - no red card and under 3 yellows
            UPDATE stores 
            SET red_count = 0, is_blocked = false 
            WHERE id = OLD.store_id;
        END IF;
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

-- Reset all stores
UPDATE stores SET yellow_count = 0, red_count = 0, is_blocked = false;

-- Delete all existing warnings
DELETE FROM warnings;

-- Verify counts are zero
SELECT id, name, yellow_count, red_count, is_blocked FROM stores LIMIT 5;
