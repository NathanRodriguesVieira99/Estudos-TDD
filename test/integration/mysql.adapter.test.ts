import type { DatabaseConnection } from "@/database-connection.ts";
import { MySQLAdapter } from "@/mysql.adapter.ts";

let sut: DatabaseConnection;

beforeEach(() => {
  sut = new MySQLAdapter(String(process.env.DATABASE_URL));
});

afterAll(async () => {
  await sut.close();
});

describe("MySQL Adapter", async () => {
  test("deve conectar ao banco de dados MySQL", async () => {
    const [row] = await sut.query(`SELECT 1 as result`, []);
    expect(row.result).toBe(1);
  });
  test("deve usar params no SQL", async () => {
    const param = 3;
    const [row] = await sut.query(`SELECT ? as result`, [param]);
    expect(row.result).toBe(param);
  });
});
