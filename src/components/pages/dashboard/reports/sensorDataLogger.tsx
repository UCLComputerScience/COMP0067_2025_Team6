import axios from 'axios';
import fs from 'fs';
import path from 'path';

interface ThingSpeakResponse {
  channel: {
    id: number;
    name: string;
    field1: string;
  };
  feeds: {
    created_at: string;
    entry_id: number;
    field1: string;
  }[];
}

// File path for the CSV
const CSV_FILE_PATH = path.join(process.cwd(), 'data', 'sensor_data.csv');

// Ensure the directory exists
const ensureDirectoryExists = (filePath: string) => {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
};

// Initialize CSV file if it doesn't exist
const initializeCSV = () => {
  ensureDirectoryExists(CSV_FILE_PATH);
  
  if (!fs.existsSync(CSV_FILE_PATH)) {
    fs.writeFileSync(CSV_FILE_PATH, 'created_at,id,name,entry_id,temperature\n');
    console.log('CSV file initialized.');
  }
};

// Function to format date to match the specified format
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().replace('T', ' ').replace('Z', ' UTC');
};

// Function to fetch data and update CSV
const fetchAndUpdateData = async () => {
  try {
    // Fetch the latest data from ThingSpeak
    const response = await axios.get<ThingSpeakResponse>(
      'https://api.thingspeak.com/channels/1598577/fields/1.json?results=2'
    );
    
    // Process and save the data
    const { channel, feeds } = response.data;
    
    let newEntries = '';
    for (const feed of feeds) {
      // Convert values to the desired format
      const formattedDate = formatDate(feed.created_at);
      const formattedLine = `${formattedDate}, ${channel.id} , "${channel.name}" ,${feed.entry_id},${feed.field1}\n`;
      
      // Check if this entry already exists in the CSV to avoid duplicates
      const fileContent = fs.existsSync(CSV_FILE_PATH) ? fs.readFileSync(CSV_FILE_PATH, 'utf8') : '';
      if (!fileContent.includes(feed.entry_id.toString())) {
        newEntries += formattedLine;
      }
    }
    
    // Append new data to the CSV file
    if (newEntries) {
      fs.appendFileSync(CSV_FILE_PATH, newEntries);
      console.log(`Added ${feeds.length} new entries to the CSV file.`);
    } else {
      console.log('No new entries to add.');
    }
  } catch (error) {
    console.error('Error fetching or processing data:', error);
  }
};

// Main function to start the data logging process
const startDataLogging = (intervalSeconds = 15) => {
  console.log(`Starting sensor data logging. Checking every ${intervalSeconds} seconds.`);
  
  // Initialize the CSV file
  initializeCSV();
  
  // Fetch data immediately
  fetchAndUpdateData();
  
  // Set up interval for repeated fetching
  const intervalId = setInterval(fetchAndUpdateData, intervalSeconds * 1000);
  
  return {
    stop: () => {
      clearInterval(intervalId);
      console.log('Sensor data logging stopped.');
    }
  };
};

export { startDataLogging };
