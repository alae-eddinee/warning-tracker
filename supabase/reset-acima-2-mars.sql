-- Manually reset ACIMA 2 MARS store counts and unblock
-- Run this in your Supabase SQL Editor

-- Reset the store counts and unblock status
UPDATE stores 
SET 
    yellow_count = 0,
    red_count = 0,
    is_blocked = false
WHERE name = 'ACIMA 2 MARS';

-- Also ensure ALL warnings are deleted for this store (just in case)
DELETE FROM warnings 
WHERE store_id IN (
    SELECT id FROM stores WHERE name = 'ACIMA 2 MARS'
);
