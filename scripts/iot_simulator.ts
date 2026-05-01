import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || "";
const client = new MongoClient(uri);

async function simulate() {
  try {
    await client.connect();
    console.log("Connected to MongoDB for IoT Simulation");
    const db = client.db('gharpayy');
    const collection = db.collection('sensor_data');

    const sensors = [
      { id: 'TEMP_01', type: 'temperature', unit: '°C' },
      { id: 'ELEC_01', type: 'electricity', unit: 'kWh' },
      { id: 'OCC_01', type: 'occupancy', unit: 'count' }
    ];

    setInterval(async () => {
      const data = sensors.map(s => {
        let value = 0;
        if (s.type === 'temperature') value = 22 + Math.random() * 5;
        if (s.type === 'electricity') value = 0.5 + Math.random() * 2;
        if (s.type === 'occupancy') value = Math.floor(Math.random() * 10);

        return {
          sensor_id: s.id,
          type: s.type,
          value: parseFloat(value.toFixed(2)),
          unit: s.unit,
          timestamp: new Date()
        };
      });

      try {
        await collection.insertMany(data);
        console.log(`[${new Date().toLocaleTimeString()}] Pushed ${data.length} sensor readings to MongoDB`);
      } catch (err) {
        console.error("Error inserting data:", err);
      }
    }, 5000);

  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
  }
}

simulate();
