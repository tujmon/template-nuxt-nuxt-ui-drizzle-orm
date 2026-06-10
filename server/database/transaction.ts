import { db } from './client'

export type TransactionClient = Parameters<Parameters<typeof db.transaction>[0]>[0]

/**
 * Executa uma operação assíncrona dentro de uma transação do Drizzle.
 * Evita o uso manual de conexões brutas em serviços.
 */
export async function runInTransaction<T>(
  callback: (tx: TransactionClient) => Promise<T>
): Promise<T> {
  return db.transaction(async (tx) => {
    return callback(tx)
  })
}
