-- Remove all rows from Alerts table
DELETE FROM "Alerts";

-- Remove all rows from Feed table
DELETE FROM "Feed";

-- Remove all rows from ApiKey table (to avoid duplicates)
DELETE FROM "ApiKey";

-- Remove all rows from Channel table
DELETE FROM "Channel";

-- Remove all rows from Labs table
DELETE FROM "Labs";

-- Insert into Labs table
INSERT INTO "Labs" (
  "id", "labLocation", "managerId"
) VALUES
  (1, 'Lab 1 - Main Facility', 3), -- Lab 1
  (2, 'Lab 2 - Secondary Site', 4); -- Lab 2

-- Insert into Channel table (aligned with earlier data)
INSERT INTO "Channel" (
  "id", "name", "latitude", "longitude", "field1", "field2", "field3", "field4", "field5", "field6", "field7", "field8", "lastEntryId", "createdAt", "updatedAt"
) VALUES
  (2606541, 'Proteus Monitor 1', 0.0, 0.0, 'Temperature', 'Humidity', 'Pressure', NULL, NULL, NULL, NULL, NULL, 12967, '2024-07-23 12:14:02+00', '2024-08-15 06:42:31+00'),
  (2035654, 'Proteus P8', 0.0, 0.0, 'Field Label 1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 123, '2023-02-16 09:04:38+00', '2024-08-02 18:57:07+00'),
  (2613687, 'Proteus Monitor 2', 0.0, 0.0, 'Temperature', 'Humidity', 'Pressure', NULL, NULL, NULL, NULL, NULL, 8026, '2024-07-31 14:04:15+00', '2024-08-02 19:03:38+00');

-- Insert into ApiKey table (aligned with earlier data)
INSERT INTO "ApiKey" (
  "id", "channelId", "api", "labId"
) VALUES
  (1, 2606541, 'https://api.thingspeak.com/channels/2606541/feeds.json', 1), -- Lab 1
  (2, 2035654, 'https://api.thingspeak.com/channels/2035654/feeds.json', 1), -- Lab 1
  (3, 2613687, 'https://api.thingspeak.com/channels/2613687/feeds.json', 2); -- Lab 2

-- Insert into Feed table (aligned with Channel IDs)
INSERT INTO "Feed" (
  "channelId", "entryId", "createdAt", "field1", "field2", "field3"
) VALUES
  -- Channel 2606541 (Proteus Monitor 1)
  (2606541, 12966, NOW(), 25.3, 45.1, 12.5),
  (2606541, 12967, NOW(), 26.1, 46.2, 13.0),
  (2606541, 12968, NOW(), 24.8, 44.9, 11.8),
  (2606541, 12969, NOW(), 27.5, 47.0, 14.2),
  (2606541, 12970, NOW(), 23.9, 43.5, 12.0),
  (2606541, 12971, NOW(), 28.0, 48.1, 15.0),
  (2606541, 12972, NOW(), 25.7, 45.8, 13.5),
  -- Channel 2035654 (Proteus P8)
  (2035654, 118, NOW(), 20.0, 35.7, 18.2), -- Adjusted entryId to fit lastEntryId (123)
  (2035654, 119, NOW(), 21.2, 36.5, 19.0),
  (2035654, 120, NOW(), 19.8, 34.9, 17.5),
  (2035654, 121, NOW(), 22.0, 37.2, 20.1),
  (2035654, 122, NOW(), 20.5, 35.0, 18.8),
  (2035654, 123, NOW(), 23.1, 38.0, 21.0), -- Matches lastEntryId
  (2035654, 124, NOW(), 19.5, 34.0, 17.0),
  -- Channel 2613687 (Proteus Monitor 2)
  (2613687, 8020, NOW(), 30.5, 40.3, 22.1), -- Adjusted entryId to fit lastEntryId (8026)
  (2613687, 8021, NOW(), 31.0, 41.5, 23.0),
  (2613687, 8022, NOW(), 29.8, 39.9, 21.5),
  (2613687, 8023, NOW(), 32.2, 42.0, 24.0),
  (2613687, 8024, NOW(), 30.0, 40.8, 22.5),
  (2613687, 8025, NOW(), 33.0, 43.5, 25.0);

-- Insert into Alerts table (aligned with Feed entryIds)
INSERT INTO "Alerts" (
  "entryId", "priority", "alertDescription", "alertStatus", "alertDate", "readStatus"
) VALUES
  -- Channel 2606541 (Proteus Monitor 1)
  (12966, 'HIGH', 'Temperature has exceeded threshold', 'RESOLVED', NOW(), 'READ'),
  (12967, 'MODERATE', 'Humidity spike detected', 'UNRESOLVED', NOW(), 'UNREAD'),
  (12968, 'LOW', 'Minor pressure fluctuation', 'RESOLVED', NOW(), 'READ'),
  (12969, 'HIGH', 'Sensor A1 critical failure', 'UNRESOLVED', NOW(), 'UNREAD'),
  (12970, 'MODERATE', 'Sensor A2 reading unstable', 'RESOLVED', NOW(), 'READ'),
  (12971, 'LOW', 'Sensor A3 minor deviation', 'UNRESOLVED', NOW(), 'UNREAD'),
  (12972, 'HIGH', 'Overheating alert', 'RESOLVED', NOW(), 'READ'),
  -- Channel 2035654 (Proteus P8)
  (118, 'MODERATE', 'Humidity levels abnormal', 'UNRESOLVED', NOW(), 'UNREAD'),
  (119, 'HIGH', 'Temperature above safe limit', 'RESOLVED', NOW(), 'READ'),
  (120, 'LOW', 'Pressure slightly below normal', 'UNRESOLVED', NOW(), 'UNREAD'),
  (121, 'MODERATE', 'Sensor B1 inconsistency', 'RESOLVED', NOW(), 'READ'),
  (122, 'HIGH', 'Critical humidity surge', 'UNRESOLVED', NOW(), 'UNREAD'),
  (123, 'LOW', 'Sensor B3 minor glitch', 'RESOLVED', NOW(), 'READ'),
  (124, 'MODERATE', 'Temperature fluctuation', 'UNRESOLVED', NOW(), 'UNREAD'),
  -- Channel 2613687 (Proteus Monitor 2)
  (8020, 'LOW', 'Pressure drop detected', 'UNRESOLVED', NOW(), 'UNREAD'),
  (8021, 'HIGH', 'Temperature critically high', 'RESOLVED', NOW(), 'READ'),
  (8022, 'MODERATE', 'Humidity out of range', 'UNRESOLVED', NOW(), 'UNREAD'),
  (8023, 'LOW', 'Sensor C1 slight deviation', 'RESOLVED', NOW(), 'READ'),
  (8024, 'HIGH', 'Overpressure warning', 'UNRESOLVED', NOW(), 'UNREAD'),
  (8025, 'MODERATE', 'Sensor C2 unstable reading', 'RESOLVED', NOW(), 'READ');

