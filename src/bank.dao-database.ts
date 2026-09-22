import mysqlConnection from "mysql2/promise";
import { ApplicationError } from "./application-error.ts";

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
  async save(dto: BankDAO.SaveDTO): Promise<number> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    );
    const [row] = await connection.query(
      `INSERT INTO banco(codigo,nome,url) VALUES(?,?,?)`,
      [dto.codigo, dto.nome, dto.url],
    );
    const bankId = (row as any).insertId;
    connection.pool.end();
    return bankId;
  }

  async list(): Promise<BankDAO.BankDTO[]> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    );
    const [rows] = await connection.query<any[]>(`SELECT * FROM banco`, []);
    connection.pool.end();
    return rows;
  }

  async remove(bankId: number): Promise<void> {
    if (isNaN(bankId))
      throw new ApplicationError("ID do Banco informado é inválido");
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    );
    await connection.query(`DELETE FROM banco WHERE banco_id = ? LIMIT 1`, [
      bankId,
    ]);
    connection.pool.end();
  }

  async getById(bankId: number): Promise<BankDAO.BankDTO | undefined> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    );
    const [rows] = await connection.query<any[]>(
      `SELECT * FROM banco WHERE banco_id = ? LIMIT 1`,
      [bankId],
    );
    const [firstRow] = rows;
    connection.pool.end();
    return firstRow;
  }

  async getByCode(code: string): Promise<BankDAO.BankDTO | undefined> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    );
    const [rows] = await connection.query<any[]>(
      `SELECT * FROM banco WHERE codigo = ? LIMIT 1`,
      [code],
    );
    const [firstRow] = rows;
    connection.pool.end();
    return firstRow;
  }

  async getByName(name: string): Promise<BankDAO.BankDTO | undefined> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    );
    const [rows] = await connection.query<any[]>(
      `SELECT * FROM banco WHERE nome = ? LIMIT 1`,
      [name],
    );
    const [firstRow] = rows;
    connection.pool.end();
    return firstRow;
  }

  async update(dto: BankDAO.UpdateDTO): Promise<void> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    );
    await connection.query(
      `UPDATE banco SET codigo = ?, nome = ?, URL = ? WHERE banco_id = ?`,
      [dto.codigo, dto.nome, dto.url, dto.id],
    );
    connection.pool.end();
  }
}
