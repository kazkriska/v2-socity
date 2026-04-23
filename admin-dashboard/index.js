import express from 'express';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Database, Resource, Adapter } from '@adminjs/sql';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

// 1. Register the AdminJS SQL Adapter
AdminJS.registerAdapter({ Database, Resource });

const PORT = process.env.PORT || 3000;

const start = async () => {
  const app = express();

  try {
    // 2. Initialize the SQL Adapter with Postgres connection details
    const db = await new Adapter('postgresql', {
      connectionString: process.env.DATABASE_URL,
      database: process.env.PG_DATABASE || 'socity_db',
    }).init();

    // 3. Configure AdminJS
    const admin = new AdminJS({
      resources: [
        // Standard Tables
        { resource: db.table('society') },
        { resource: db.table('pocket') },
        { resource: db.table('resident') },
        { resource: db.table('payment') },
        
        // SQL Views (Read-Only)
        {
          resource: db.table('resident_details'),
          options: {
            navigation: { name: 'Views', icon: 'View' },
            listProperties: ['resident_id', 'society_name', 'pocket_name', 'flat_number'],
            properties: {
              resident_id: { isId: true, type: 'number' },
              flat_number: { type: 'number' },
            },
            actions: {
              new: { isAccessible: false },
              edit: { isAccessible: false },
              delete: { isAccessible: false },
              bulkDelete: { isAccessible: false },
            },
          },
        },
        {
          resource: db.table('payment_details'),
          options: {
            navigation: { name: 'Views', icon: 'View' },
            listProperties: ['payment_id', 'flat_number', 'amount_due', 'late_fee', 'due_date', 'paid', 'payment_for_month'],
            properties: {
              payment_id: { isId: true, type: 'number' },
              amount_due: { type: 'number' },
              late_fee: { type: 'number' },
              paid: { type: 'boolean' },
              due_date: { type: 'date' },
            },
            actions: {
              new: { isAccessible: false },
              edit: { isAccessible: false },
              delete: { isAccessible: false },
              bulkDelete: { isAccessible: false },
            },
          },
        },
      ],
      rootPath: '/admin',
      branding: {
        companyName: 'Socity Admin Dashboard',
        withMadeWithLove: false,
      },
    });

    // 4. Build and mount the Express router
    const adminRouter = AdminJSExpress.buildRouter(admin);
    app.use(admin.options.rootPath, adminRouter);

    // 5. Start the Express server
    app.listen(PORT, () => {
      console.log(`AdminJS is successfully running at http://localhost:${PORT}${admin.options.rootPath}`);
    });
  } catch (error) {
    console.error('Failed to initialize AdminJS or connect to the database:', error);
    process.exit(1);
  }
};

start();
