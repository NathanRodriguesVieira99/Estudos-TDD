import { Bank } from "@/bank.ts";
import mysqlConnection from "mysql2/promise";
import { ApplicationError } from "./application-error.ts";

/*
 * Repositories são para persistência de objetos de domain (entidades de domínio), devem retornar entidades completas
 */
export interface BankRepository {
  save(bank: Bank): Promise<Bank>;
  list(): Promise<Bank[]>;
  remove(bankId: number): Promise<void>;
  findById(bankId: number): Promise<Bank | undefined>;
  findByCode(code: string): Promise<Bank | undefined>;
  findByName(name: string): Promise<Bank | undefined>;
  update(bank: Bank): Promise<void>;
}

export class BankRepositoryDatabase implements BankRepository {
  async save(bank: Bank): Promise<Bank> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    );
    const [row] = await connection.query(
      `INSERT INTO banco(codigo,nome,url) VALUES(?,?,?)`,
      [bank.getCode(), bank.getName(), bank.getUrl()],
    );
    const bankId = (row as any).insertId;
    connection.pool.end();
    const savedBank = Bank.restore({
      id: bankId,
      name: bank.getName(),
      code: bank.getCode(),
      url: bank.getUrl(),
    });
    return savedBank;
  }

  async list(): Promise<Bank[]> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    );
    const [rows] = await connection.query<any[]>(`SELECT * FROM banco`, []);
    connection.pool.end();
    const bankList: Bank[] = [];
    for (const row of rows) {
      const bank = Bank.restore({
        id: row.banco_id,
        code: row.codigo,
        name: row.nome,
        url: row.url,
      });
      bankList.push(bank);
    }
    return bankList;
  }

  async remove(bankId: number): Promise<void> {
    if (isNaN(bankId)) throw new ApplicationError("ID do banco inválido");
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    );
    await connection.query(`DELETE FROM banco WHERE banco_id = ? LIMIT 1`, [
      bankId,
    ]);
    connection.pool.end();
  }

  async findById(bankId: number): Promise<Bank | undefined> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    );
    const [rows] = await connection.query<any[]>(
      `SELECT * FROM banco WHERE banco_id = ? LIMIT 1`,
      [bankId],
    );
    const [firstRow] = rows;
    connection.pool.end();
    if (!firstRow) return;
    const bank = Bank.restore({
      id: firstRow.banco_id,
      code: firstRow.codigo,
      name: firstRow.nome,
      url: firstRow.url,
    });
    return bank;
  }

  async findByCode(code: string): Promise<Bank | undefined> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    );
    const [rows] = await connection.query<any[]>(
      `SELECT * FROM banco WHERE codigo = ? LIMIT 1`,
      [code],
    );
    const [firstRow] = rows;
    connection.pool.end();
    if (!firstRow) return;
    const bank = Bank.restore({
      id: firstRow.banco_id,
      code: firstRow.codigo,
      name: firstRow.nome,
      url: firstRow.url,
    });
    return bank;
  }

  async findByName(name: string): Promise<Bank | undefined> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    );
    const [rows] = await connection.query<any[]>(
      `SELECT * FROM banco WHERE nome = ? LIMIT 1`,
      [name],
    );
    const [firstRow] = rows;
    connection.pool.end();
    if (!firstRow) return;
    const bank = Bank.restore({
      id: firstRow.banco_id,
      code: firstRow.codigo,
      name: firstRow.nome,
      url: firstRow.url,
    });
    return bank;
  }

  async update(bank: Bank): Promise<void> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    );
    await connection.query(
      `UPDATE banco SET codigo = ?, nome = ?, URL = ? WHERE banco_id = ?`,
      [bank.getCode(), bank.getName(), bank.getUrl(), bank.getId()],
    );
    connection.pool.end();
  }
}
