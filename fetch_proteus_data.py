import requests
import csv
import os
from datetime import datetime
import time

# ThingSpeak API URL
API_URL = "https://api.thingspeak.com/channels/1598577/fields/1.json?results=2"

# Global variables to track entries for each device
device_entries = {}  # Format: {'device_name': {set of entry_ids}}

def get_csv_filename(device_name):
    """Generate CSV filename based on device name"""
    clean_name = device_name.replace(" ", "_").replace('"', '').replace("'", "")
    return f"{clean_name}_sensor_data.csv"

def initialize_csv(device_name):
    """Create the CSV file with headers if it doesn't exist"""
    csv_file = get_csv_filename(device_name)
    if not os.path.exists(csv_file):
        with open(csv_file, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(['created_at', 'id', 'name', 'entry_id', 'temperature'])
        print(f"Created new CSV file: {csv_file}")
    return csv_file

def format_date(date_string):
    """Format the date to match the specified format"""
    date_obj = datetime.strptime(date_string, "%Y-%m-%dT%H:%M:%SZ")
    return date_obj.strftime("%Y-%m-%d %H:%M:%S UTC")

def load_existing_entries(device_name):
    """Load all existing entry IDs from CSV into memory for a specific device"""
    global device_entries
    
    # Initialize an empty set for this device if not already present
    if device_name not in device_entries:
        device_entries[device_name] = set()
    
    # Get the filename for this device
    csv_file = get_csv_filename(device_name)
    
    # Load entries if the file exists
    if os.path.exists(csv_file):
        with open(csv_file, 'r') as file:
            reader = csv.reader(file)
            next(reader, None)  # Skip header
            for row in reader:
                if len(row) >= 4:
                    device_entries[device_name].add(row[3])
    
    return device_entries[device_name]

def fetch_and_save_data():
    """Fetch data from ThingSpeak API and save to CSV"""
    try:
        # Fetch data from API
        response = requests.get(API_URL)
        data = response.json()
        
        # Extract channel and feeds information
        channel = data['channel']
        device_name = channel["name"]
        
        # Get/create CSV file for this device - IMPORTANT: use the returned filename
        csv_file = initialize_csv(device_name)
        
        # Load existing entries for this device
        entries = load_existing_entries(device_name)
        
        # Process only the first entry in the feeds array
        if 'feeds' in data and data['feeds'] and len(data['feeds']) > 0:
            feed = data['feeds'][0]  # Take only the first entry
            entry_id = str(feed['entry_id'])
            
            # Skip if already in CSV
            if entry_id not in entries:
                formatted_date = format_date(feed['created_at'])
                temperature = feed['field1']
                
                # Write to CSV - IMPORTANT: use csv_file, not a global CSV_FILE
                with open(csv_file, 'a', newline='') as file:
                    writer = csv.writer(file)
                    writer.writerow([
                        formatted_date,
                        channel['id'],
                        device_name,
                        entry_id,
                        temperature
                    ])
                # Add to our in-memory set
                device_entries[device_name].add(entry_id)
                print(f"Added new entry (ID: {entry_id}) to {csv_file}")
            else:
                print(f"Entry already exists in {csv_file}")
        else:
            print("No feeds data in API response.")
            
        return True
    except Exception as e:
        print(f"Error fetching or saving data: {e}")
        return False

# Main execution
if __name__ == "__main__":
    try:
        interval = 13  # seconds
        print(f"Starting continuous logging every {interval} seconds. Press Ctrl+C to stop.")
        
        # No CSV_FILE initialization here - it will be handled dynamically
        
        # Continuous polling
        while True:
            fetch_and_save_data()
            time.sleep(interval)
    except KeyboardInterrupt:
        print("Logging stopped by user.")
