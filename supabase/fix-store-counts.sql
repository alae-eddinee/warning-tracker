-- Fix stale store counts - Run this in Supabase SQL Editor
-- This recalculates all store counts based on actual warnings

-- Recalculate ALL store counts based on actual warnings
DO $$
DECLARE
    store_record RECORD;
    actual_yellow INT;
    actual_red INT;
BEGIN
    FOR store_record IN SELECT id FROM stores LOOP
        -- Count actual warnings
        SELECT COUNT(*) INTO actual_yellow
        FROM warnings
        WHERE store_id = store_record.id AND type = 'yellow';
        
        SELECT COUNT(*) INTO actual_red
        FROM warnings
        WHERE store_id = store_record.id AND type = 'red';
        
        -- Update store with correct counts (use explicit column references)
        UPDATE stores
        SET 
            yellow_count = actual_yellow,
            red_count = actual_red,
            is_blocked = (actual_red >= 1)
        WHERE id = store_record.id;
    END LOOP;
END $$;
