export type RecordType = "expense" | "income";

export interface LedgerRecord {
  _id: string;
  _openid: string;
  amount: number;
  type: RecordType;
  category: string;
  note?: string;
  date: string;
  createdAt: number;
  updatedAt: number;
}

export interface UpsertRecordPayload {
  amount: number;
  type: RecordType;
  category: string;
  note?: string;
  date: string;
}
