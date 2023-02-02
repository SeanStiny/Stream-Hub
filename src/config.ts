import dotenv from 'dotenv';

// Load config from .env file
dotenv.config();

export const HTTP_PORT = parseInt(process.env.HTTP_PORT || '5000');
export const IO_PORT = parseInt(process.env.IO_PORT || '5001');
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
export const EVENTSUB_SECRET = process.env.EVENTSUB_SECRET || '';
export const TMI_USER = process.env.TMI_USER || '';
export const TMI_PASS = process.env.TMI_PASS || '';
export const TWITCH_CHANNEL = process.env.TWITCH_CHANNEL || '';
