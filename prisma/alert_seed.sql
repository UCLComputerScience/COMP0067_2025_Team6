-- Remove all rows from Alerts table
DELETE FROM "Alerts";

-- Remove all rows from Feed table
DELETE FROM "Feed";

-- Remove all rows from Channel table
DELETE FROM "Channel";

-- Insert into Channel table (unchanged)
INSERT INTO "Channel" (id, name, latitude, longitude, field1, field2, field3, "lastEntryId")
VALUES 
(2606541, 'Proteus Monitor 1', 0.0, 0.0, 'Sensor A1', 'Sensor A2', 'Sensor A3', 1001),
(2007, 'Channel B', 1.2903, 103.8521, 'Sensor B1', 'Sensor B2', 'Sensor B3', 1002),
(3003, 'Channel C', 1.3644, 103.9915, 'Sensor C1', 'Sensor C2', 'Sensor C3', 1003);

-- Insert into Feed table (unchanged)
INSERT INTO "Feed" ("channelId", "entryId", "createdAt", field1, field2, field3)
VALUES
(2606541, 12966, NOW(), 25.3, 45.1, 12.5),  
(2606541, 12967, NOW(), 26.1, 46.2, 13.0),
(2606541, 12968, NOW(), 24.8, 44.9, 11.8),
(2606541, 12969, NOW(), 27.5, 47.0, 14.2),
(2606541, 12970, NOW(), 23.9, 43.5, 12.0),
(2606541, 12971, NOW(), 28.0, 48.1, 15.0),
(2606541, 12972, NOW(), 25.7, 45.8, 13.5),
(2007, 1002, NOW(), 20.0, 35.7, 18.2),   
(2007, 1004, NOW(), 21.2, 36.5, 19.0),
(2007, 1005, NOW(), 19.8, 34.9, 17.5),
(2007, 1006, NOW(), 22.0, 37.2, 20.1),
(2007, 1007, NOW(), 20.5, 35.0, 18.8),
(2007, 1008, NOW(), 23.1, 38.0, 21.0),
(2007, 1009, NOW(), 19.5, 34.0, 17.0),
(3003, 1003, NOW(), 30.5, 40.3, 22.1),     
(3003, 1010, NOW(), 31.0, 41.5, 23.0),
(3003, 1011, NOW(), 29.8, 39.9, 21.5),
(3003, 1012, NOW(), 32.2, 42.0, 24.0),
(3003, 1013, NOW(), 30.0, 40.8, 22.5),
(3003, 1014, NOW(), 33.0, 43.5, 25.0);

-- Insert into Alerts table (updated with readStatus)
INSERT INTO "Alerts" ("entryId", priority, "alertDescription", "alertStatus", "alertDate", "readStatus")
VALUES
-- Channel 2606541 (Proteus Monitor 1)
(12966, 'HIGH', 'Temperature has exceeded threshold', 'RESOLVED', NOW(), 'READ'), 
(12967, 'MODERATE', 'Humidity spike detected', 'UNRESOLVED', NOW(), 'UNREAD'),
(12968, 'LOW', 'Minor pressure fluctuation', 'RESOLVED', NOW(), 'READ'),
(12969, 'HIGH', 'Sensor A1 critical failure', 'UNRESOLVED', NOW(), 'UNREAD'),
(12970, 'MODERATE', 'Sensor A2 reading unstable', 'RESOLVED', NOW(), 'READ'),
(12971, 'LOW', 'Sensor A3 minor deviation', 'UNRESOLVED', NOW(), 'UNREAD'),
(12972, 'HIGH', 'Overheating alert', 'RESOLVED', NOW(), 'READ'),

-- Channel 2007 (Channel B)
(1002, 'MODERATE', 'Humidity levels abnormal', 'UNRESOLVED', NOW(), 'UNREAD'),     
(1004, 'HIGH', 'Temperature above safe limit', 'RESOLVED', NOW(), 'READ'),
(1005, 'LOW', 'Pressure slightly below normal', 'UNRESOLVED', NOW(), 'UNREAD'),
(1006, 'MODERATE', 'Sensor B1 inconsistency', 'RESOLVED', NOW(), 'READ'),
(1007, 'HIGH', 'Critical humidity surge', 'UNRESOLVED', NOW(), 'UNREAD'),
(1008, 'LOW', 'Sensor B3 minor glitch', 'RESOLVED', NOW(), 'READ'),
(1009, 'MODERATE', 'Temperature fluctuation', 'UNRESOLVED', NOW(), 'UNREAD'),

-- Channel 3003 (Channel C)
(1003, 'LOW', 'Pressure drop detected', 'UNRESOLVED', NOW(), 'UNREAD'),          
(1010, 'HIGH', 'Temperature critically high', 'RESOLVED', NOW(), 'READ'),
(1011, 'MODERATE', 'Humidity out of range', 'UNRESOLVED', NOW(), 'UNREAD'),
(1012, 'LOW', 'Sensor C1 slight deviation', 'RESOLVED', NOW(), 'READ'),
(1013, 'HIGH', 'Overpressure warning', 'UNRESOLVED', NOW(), 'UNREAD'),
(1014, 'MODERATE', 'Sensor C2 unstable reading', 'RESOLVED', NOW(), 'READ');