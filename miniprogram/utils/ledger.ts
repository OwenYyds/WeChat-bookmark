import type { LedgerRecord, UpsertRecordPayload } from "../types/ledger";

const db = wx.cloud.database();
const COLLECTION = "transactions";

export async function listRecords(month: string): Promise<LedgerRecord[]> {
  const start = `${month}-01`;
  const end = `${month}-31`;
  const _ = db.command;

  const result = (await db
    .collection(COLLECTION)
    .where({
      date: _.gte(start).and(_.lte(end)),
    })
    .orderBy("date", "desc")
    .orderBy("createdAt", "desc")
    .get()) as { data: unknown[] };

  return result.data as LedgerRecord[];
}

export async function getRecordById(id: string): Promise<LedgerRecord | null> {
  const result = (await db.collection(COLLECTION).doc(id).get()) as {
    data?: unknown;
  };

  return (result.data as LedgerRecord | undefined) ?? null;
}

export async function createRecord(
  payload: UpsertRecordPayload
): Promise<void> {
  const now = Date.now();
  await db.collection(COLLECTION).add({
    data: {
      ...payload,
      createdAt: now,
      updatedAt: now,
    },
  });
}

export async function updateRecord(
  id: string,
  payload: UpsertRecordPayload
): Promise<void> {
  await db
    .collection(COLLECTION)
    .doc(id)
    .update({
      data: {
        ...payload,
        updatedAt: Date.now(),
      },
    });
}

export async function deleteRecord(id: string): Promise<void> {
  await db.collection(COLLECTION).doc(id).remove();
}
