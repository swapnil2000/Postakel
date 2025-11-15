import { getMasterPrisma } from './masterPrisma';

interface AuditMetadata {
  [key: string]: unknown;
}

export async function recordAdminAudit(
  adminId: string | undefined,
  action: string,
  targetType: string,
  targetId?: string,
  metadata?: AuditMetadata
) {
  const masterPrisma = getMasterPrisma();

  await masterPrisma.adminAuditLog.create({
    data: {
      adminId,
      action,
      targetType,
      targetId,
      metadata: metadata as any,
    },
  });
}
