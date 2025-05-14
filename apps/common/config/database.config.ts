import { MongooseModuleOptions } from '@nestjs/mongoose';

export const databaseConfig: { uri: string; options: MongooseModuleOptions } = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/auth-microservice',
  options: {},
};
