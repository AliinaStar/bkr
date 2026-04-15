import { useSQLiteContext } from 'expo-sqlite';
import { Goal, GoalStatus } from './types';

export function useGoals() {
  const db = useSQLiteContext();

  async function getAll(): Promise<Goal[]> {
    return db.getAllAsync<Goal>(
      `SELECT * FROM goals ORDER BY created_at DESC`
    );
  }

  async function getById(id: string): Promise<Goal | null> {
    return db.getFirstAsync<Goal>(
      `SELECT * FROM goals WHERE id = ?`,
      [id]
    );
  }

  async function getActive(): Promise<Goal[]> {
    return db.getAllAsync<Goal>(
      `SELECT * FROM goals WHERE status = 'active' ORDER BY created_at DESC`
    );
  }

  async function create(data: {
    title: string;
    description?: string;
    deadline?: string;
    status?: GoalStatus;
  }): Promise<Goal> {
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString().split('T')[0];
    const status = data.status ?? 'active';

    await db.runAsync(
      `INSERT INTO goals (id, title, description, deadline, created_at, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, data.title, data.description ?? null, data.deadline ?? null, created_at, status]
    );

    return (await getById(id))!;
  }

  async function update(id: string, data: Partial<Pick<Goal, 'title' | 'description' | 'deadline' | 'status'>>): Promise<void> {
    const fields: string[] = [];
    const values: (string | null)[] = [];

    if (data.title !== undefined)       { fields.push('title = ?');       values.push(data.title); }
    if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
    if (data.deadline !== undefined)    { fields.push('deadline = ?');    values.push(data.deadline); }
    if (data.status !== undefined)      { fields.push('status = ?');      values.push(data.status); }

    if (fields.length === 0) return;

    fields.push('synced = 0');
    values.push(id);

    await db.runAsync(
      `UPDATE goals SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  async function remove(id: string): Promise<void> {
    // entries cascade delete via foreign key
    await db.runAsync(`DELETE FROM goals WHERE id = ?`, [id]);
  }

  // Called after successful sync with backend
  async function markSynced(id: string, remoteId: number): Promise<void> {
    await db.runAsync(
      `UPDATE goals SET synced = 1, remote_id = ? WHERE id = ?`,
      [remoteId, id]
    );
  }

  async function getUnsynced(): Promise<Goal[]> {
    return db.getAllAsync<Goal>(
      `SELECT * FROM goals WHERE synced = 0`
    );
  }

  return { getAll, getById, getActive, create, update, remove, markSynced, getUnsynced };
}
