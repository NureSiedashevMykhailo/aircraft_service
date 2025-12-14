import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function setupTimescaleDB() {
  try {
    console.log('🔧 Setting up TimescaleDB...');

    // Проверяем наличие расширения TimescaleDB
    console.log('📦 Checking TimescaleDB extension...');
    await prisma.$executeRawUnsafe(`
      CREATE EXTENSION IF NOT EXISTS timescaledb;
    `);
    console.log('✅ TimescaleDB extension is ready');

    // Преобразуем таблицу в hypertable
    console.log('🔄 Converting telemetry table to hypertable...');
    try {
      await prisma.$executeRawUnsafe(`
        SELECT create_hypertable('telemetry', 'time', 
          chunk_time_interval => INTERVAL '1 day',
          if_not_exists => TRUE
        );
      `);
      console.log('✅ Hypertable created successfully!');
    } catch (error: any) {
      if (error.message.includes('already a hypertable') || error.message.includes('already exists')) {
        console.log('ℹ️  Table "telemetry" is already a hypertable');
      } else {
        throw error;
      }
    }

    // Создаем индексы
    console.log('📊 Creating optimized indexes...');
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS idx_telemetry_aircraft_time 
        ON telemetry (aircraft_id, time DESC);
      
      CREATE INDEX IF NOT EXISTS idx_telemetry_parameter_time 
        ON telemetry (parameter_name, time DESC);
    `);
    console.log('✅ Indexes created');

    console.log('\n🎉 TimescaleDB setup completed successfully!');
    console.log('📊 Table "telemetry" is now a TimescaleDB hypertable with optimized indexes');
  } catch (error: any) {
    console.error('❌ Error setting up TimescaleDB:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

setupTimescaleDB()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

