import type { DatabaseConnection } from "./database-connection.ts";
import { createPool, type Pool } from "mysql2/promise";

/*
 * Adapter Pattern é um Design Pattern Estrutural que permite que conectemos interfaces incompatíveis, ou seja,
 * funciona como um tradutor/wrapper para quando queremos integrar APIs ou libs externas sem acoplar o nosso código e sem modificar os códigos externos.
 */

//* adapter                          interface
export class MySQLAdapter implements DatabaseConnection {
  private connection: Pool;
  constructor(databaseUrl: string) {
    this.connection = createPool(databaseUrl);
  }

  async query(statement: string, params: any[]): Promise<any> {
    const [rows] = await this.connection.query(statement, params);
    return rows;
  }

  async close(): Promise<void> {
    this.connection.pool.end();
  }
}
