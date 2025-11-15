import { PrismaClient as MasterPrismaClient } from '../generated/master';

let masterClient: MasterPrismaClient | null = null;

export function getMasterPrisma() {
  if (!masterClient) {
    masterClient = new MasterPrismaClient();
  }

  return masterClient;
}
