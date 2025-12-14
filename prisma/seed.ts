import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aircraft-monitoring.local' },
    update: {},
    create: {
      email: 'admin@aircraft-monitoring.local',
      full_name: 'Admin User',
      password_hash: '$2b$10$rQZ8XK5J8XK5J8XK5J8XK5eXK5J8XK5J8XK5J8XK5J8XK5J8XK5J8XK',
      role: 'admin',
    },
  });

  const engineer1 = await prisma.user.upsert({
    where: { email: 'engineer1@aircraft-monitoring.local' },
    update: {},
    create: {
      email: 'engineer1@aircraft-monitoring.local',
      full_name: 'John Engineer',
      password_hash: '$2b$10$rQZ8XK5J8XK5J8XK5J8XK5eXK5J8XK5J8XK5J8XK5J8XK5J8XK5J8XK',
      role: 'engineer',
    },
  });

  const engineer2 = await prisma.user.upsert({
    where: { email: 'engineer2@aircraft-monitoring.local' },
    update: {},
    create: {
      email: 'engineer2@aircraft-monitoring.local',
      full_name: 'Jane Technician',
      password_hash: '$2b$10$rQZ8XK5J8XK5J8XK5J8XK5eXK5J8XK5J8XK5J8XK5J8XK5J8XK5J8XK',
      role: 'technician',
    },
  });

  console.log('Created users:', { admin: admin.email, engineer1: engineer1.email, engineer2: engineer2.email });

  // Create aircrafts
  const aircraft1 = await prisma.aircraft.upsert({
    where: { reg_number: 'RA-12345' },
    update: {},
    create: {
      reg_number: 'RA-12345',
      model: 'Boeing 737-800',
      manufacture_date: new Date('2015-06-15'),
      total_flight_hours: 12500.5,
      last_maintenance_date: new Date('2024-01-10'),
    },
  });

  const aircraft2 = await prisma.aircraft.upsert({
    where: { reg_number: 'RA-67890' },
    update: {},
    create: {
      reg_number: 'RA-67890',
      model: 'Airbus A320',
      manufacture_date: new Date('2018-03-20'),
      total_flight_hours: 8500.0,
      last_maintenance_date: new Date('2024-02-05'),
    },
  });

  const aircraft3 = await prisma.aircraft.upsert({
    where: { reg_number: 'RA-11111' },
    update: {},
    create: {
      reg_number: 'RA-11111',
      model: 'Boeing 777-300ER',
      manufacture_date: new Date('2020-11-10'),
      total_flight_hours: 3200.0,
      last_maintenance_date: new Date('2024-03-15'),
    },
  });

  console.log('Created aircrafts:', { aircraft1: aircraft1.reg_number, aircraft2: aircraft2.reg_number, aircraft3: aircraft3.reg_number });

  // Create components
  // Delete existing components for these aircrafts to avoid duplicates
  await prisma.component.deleteMany({
    where: {
      aircraft_id: {
        in: [aircraft1.aircraft_id, aircraft2.aircraft_id, aircraft3.aircraft_id],
      },
    },
  });

  const component1 = await prisma.component.create({
    data: {
      aircraft_id: aircraft1.aircraft_id,
      name: 'Left Engine',
      serial_number: 'ENG-L-001',
      installed_at: new Date('2020-01-15'),
      life_limit_hours: 20000.0,
      current_wear_hours: 15000.0,
    },
  });

  const component2 = await prisma.component.create({
    data: {
      aircraft_id: aircraft1.aircraft_id,
      name: 'Right Engine',
      serial_number: 'ENG-R-001',
      installed_at: new Date('2020-01-15'),
      life_limit_hours: 20000.0,
      current_wear_hours: 14800.0,
    },
  });

  const component3 = await prisma.component.create({
    data: {
      aircraft_id: aircraft2.aircraft_id,
      name: 'Main Landing Gear',
      serial_number: 'LG-M-001',
      installed_at: new Date('2018-03-20'),
      life_limit_hours: 15000.0,
      current_wear_hours: 8500.0,
    },
  });

  console.log('Created components');

  // Create telemetry records
  const now = new Date();
  const telemetryRecords = [];
  
  for (let i = 0; i < 10; i++) {
    const time = new Date(now.getTime() - i * 60000); // 1 minute intervals
    telemetryRecords.push({
      time,
      aircraft_id: aircraft1.aircraft_id,
      parameter_name: 'engine_temperature',
      value: 85.5 + Math.random() * 10,
    });
    telemetryRecords.push({
      time,
      aircraft_id: aircraft1.aircraft_id,
      parameter_name: 'fuel_level',
      value: 70.0 + Math.random() * 20,
    });
    telemetryRecords.push({
      time,
      aircraft_id: aircraft1.aircraft_id,
      parameter_name: 'altitude',
      value: 10000 + Math.random() * 5000,
    });
  }

  // Add some telemetry for aircraft2
  for (let i = 0; i < 5; i++) {
    const time = new Date(now.getTime() - i * 60000);
    telemetryRecords.push({
      time,
      aircraft_id: aircraft2.aircraft_id,
      parameter_name: 'engine_temperature',
      value: 82.0 + Math.random() * 8,
    });
    telemetryRecords.push({
      time,
      aircraft_id: aircraft2.aircraft_id,
      parameter_name: 'fuel_level',
      value: 75.0 + Math.random() * 15,
    });
  }

  await prisma.telemetry.createMany({
    data: telemetryRecords,
    skipDuplicates: true,
  });

  console.log(`Created ${telemetryRecords.length} telemetry records`);

  // Create alerts
  const alert1 = await prisma.alert.create({
    data: {
      aircraft_id: aircraft1.aircraft_id,
      severity: 'warning',
      message: 'Engine temperature exceeds normal range',
      is_acknowledged: false,
    },
  });

  const alert2 = await prisma.alert.create({
    data: {
      aircraft_id: aircraft1.aircraft_id,
      severity: 'info',
      message: 'Scheduled maintenance approaching',
      is_acknowledged: true,
    },
  });

  const alert3 = await prisma.alert.create({
    data: {
      aircraft_id: aircraft2.aircraft_id,
      severity: 'critical',
      message: 'Fuel level below threshold',
      is_acknowledged: false,
    },
  });

  console.log('Created alerts');

  // Create maintenance schedules
  const schedule1 = await prisma.maintenanceSchedule.create({
    data: {
      aircraft_id: aircraft1.aircraft_id,
      scheduled_date: new Date('2024-02-15'),
      description: 'Planned engine maintenance',
      status: 'pending',
      is_predicted: false,
    },
  });

  const schedule2 = await prisma.maintenanceSchedule.create({
    data: {
      aircraft_id: aircraft1.aircraft_id,
      scheduled_date: new Date('2024-03-20'),
      description: 'Routine inspection',
      status: 'pending',
      is_predicted: true,
    },
  });

  const schedule3 = await prisma.maintenanceSchedule.create({
    data: {
      aircraft_id: aircraft2.aircraft_id,
      scheduled_date: new Date('2024-02-25'),
      description: 'Landing gear maintenance',
      status: 'in_progress',
      is_predicted: false,
    },
  });

  console.log('Created maintenance schedules');

  // Create maintenance tasks
  const task1 = await prisma.maintenanceTask.create({
    data: {
      schedule_id: schedule1.schedule_id,
      assigned_user_id: engineer1.user_id,
      description: 'Check cooling system',
      is_completed: false,
    },
  });

  const task2 = await prisma.maintenanceTask.create({
    data: {
      schedule_id: schedule1.schedule_id,
      assigned_user_id: engineer2.user_id,
      description: 'Inspect engine components',
      is_completed: false,
    },
  });

  const component4 = await prisma.component.create({
    data: {
      aircraft_id: aircraft3.aircraft_id,
      name: 'Navigation System',
      serial_number: 'NAV-001',
      installed_at: new Date('2020-11-10'),
      life_limit_hours: 30000.0,
      current_wear_hours: 3200.0,
    },
  });

  const task4 = await prisma.maintenanceTask.create({
    data: {
      schedule_id: schedule3.schedule_id,
      assigned_user_id: engineer1.user_id,
      description: 'Replace landing gear components',
      is_completed: true,
      completed_at: new Date('2024-02-20'),
    },
  });

  console.log('Created maintenance tasks');

  console.log('✅ Database seeded successfully!');
  console.log('\nSummary:');
  console.log(`- Users: 3 (admin, engineer1, engineer2)`);
  console.log(`- Aircrafts: 3 (RA-12345, RA-67890, RA-11111)`);
  console.log(`- Components: 4`);
  console.log(`- Telemetry records: ${telemetryRecords.length}`);
  console.log(`- Alerts: 3`);
  console.log(`- Maintenance schedules: 3`);
  console.log(`- Maintenance tasks: 4`);
  console.log('\nYou can now test the API with:');
  console.log(`- GET /api/aircrafts/1 - Get aircraft info`);
  console.log(`- POST /api/telemetry - Create telemetry (use aircraft_id: 1, 2, or 3)`);
  console.log(`- GET /api/alerts/1 - Get alerts for aircraft 1`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

