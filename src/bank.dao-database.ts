import mysqlConnection from "mysql2/promise";
import { ApplicationError } from "./application-error.ts";
import type { DatabaseConnection } from "./database-connection.ts";

/*
 * DAO abstrai uma tabela do banco de dados de forma 1:1 e trafega/manipula apanas DTOs.
 * Não possui "inteligência".
 */
export interface BankDAO {
  save(dto: BankDAO.SaveDTO): Promise<number>;
  list(): Promise<BankDAO.BankDTO[]>;
  remove(bankId: number): Promise<void>;
  getById(bankId: number): Promise<BankDAO.BankDTO | undefined>;
  getByCode(code: string): Promise<BankDAO.BankDTO | undefined>;
  getByName(name: string): Promise<BankDAO.BankDTO | undefined>;
  update(dto: BankDAO.UpdateDTO): Promise<void>;
}

export namespace BankDAO {
  export type SaveDTO = {
    codigo: string;
    nome: string;
    url: string;
  };
  export type UpdateDTO = {
    id: number;
    codigo: string;
    nome: string;
    url: string;
  };
  export type BankDTO = {
    banco_id: number;
    codigo: string;
    nome: string;
    url: string;
  };
}

export class BankDAODatabase implements BankDAO {
  constructor(private databaseConnection: DatabaseConnection) {}

  async save(dto: BankDAO.SaveDTO): Promise<number> {
    const [row] = await this.databaseConnection.query(
      `INSERT INTO banco(codigo,nome,url) VALUES(?,?,?) RETURNING *`,
      [dto.codigo, dto.nome, dto.url],
    );
    const bankId = row.banco_id;
    return bankId;
  }

  async list(): Promise<BankDAO.BankDTO[]> {
    const rows = await this.databaseConnection.query(`SELECT * FROM banco`, []);
    return rows;
  }

  async remove(bankId: number): Promise<void> {
    if (isNaN(bankId))
      throw new ApplicationError("ID do Banco informado é inválido");
    await this.databaseConnection.query(
      `DELETE FROM banco WHERE banco_id = ? LIMIT 1`,
      [bankId],
    );
  }

  async getById(bankId: number): Promise<BankDAO.BankDTO | undefined> {
    const [firstRow] = await this.databaseConnection.query(
      `SELECT * FROM banco WHERE banco_id = ? LIMIT 1`,
      [bankId],
    );
    return firstRow;
  }

  async getByCode(code: string): Promise<BankDAO.BankDTO | undefined> {
    const [firstRow] = await this.databaseConnection.query(
      `SELECT * FROM banco WHERE codigo = ? LIMIT 1`,
      [code],
    );
    return firstRow;
  }

  async getByName(name: string): Promise<BankDAO.BankDTO | undefined> {
    const [firstRow] = await this.databaseConnection.query(
      `SELECT * FROM banco WHERE nome = ? LIMIT 1`,
      [name],
    );
    return firstRow;
  }

  async update(dto: BankDAO.UpdateDTO): Promise<void> {
    await this.databaseConnection.query(
      `UPDATE banco SET codigo = ?, nome = ?, URL = ? WHERE banco_id = ?`,
      [dto.codigo, dto.nome, dto.url, dto.id],
    );
  }
}
