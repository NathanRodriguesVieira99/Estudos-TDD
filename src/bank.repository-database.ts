import { Bank } from "@/bank.ts";
import { ApplicationError } from "./application-error.ts";
import type { DatabaseConnection } from "./database-connection.ts";

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
  constructor(private databaseConnection: DatabaseConnection) {}

  async save(bank: Bank): Promise<Bank> {
    const rows = await this.databaseConnection.query(
      `INSERT INTO banco(codigo,nome,url) VALUES(?,?,?) RETURNING *`,
      [bank.getCode(), bank.getName(), bank.getUrl()],
    );
    const [row] = rows;
    const bankId = row.banco_id;
    const savedBank = Bank.restore({
      id: bankId,
      name: bank.getName(),
      code: bank.getCode(),
      url: bank.getUrl(),
    });
    return savedBank;
  }

  async list(): Promise<Bank[]> {
    const rows = await this.databaseConnection.query(`SELECT * FROM banco`, []);
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
    await this.databaseConnection.query(
      `DELETE FROM banco WHERE banco_id = ? LIMIT 1`,
      [bankId],
    );
  }

  async findById(bankId: number): Promise<Bank | undefined> {
    const [firstRow] = await this.databaseConnection.query(
      `SELECT * FROM banco WHERE banco_id = ? LIMIT 1`,
      [bankId],
    );
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
    const [firstRow] = await this.databaseConnection.query(
      `SELECT * FROM banco WHERE codigo = ? LIMIT 1`,
      [code],
    );
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
    const [firstRow] = await this.databaseConnection.query(
      `SELECT * FROM banco WHERE nome = ? LIMIT 1`,
      [name],
    );
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
    await this.databaseConnection.query(
      `UPDATE banco SET codigo = ?, nome = ?, URL = ? WHERE banco_id = ?`,
      [bank.getCode(), bank.getName(), bank.getUrl(), bank.getId()],
    );
  }
}
