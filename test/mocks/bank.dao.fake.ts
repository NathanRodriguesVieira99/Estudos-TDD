import type { BankDAO } from "@/bank.dao-database.ts";

export class BankDAOFake implements BankDAO {
  private bankList: any[];

  constructor() {
    this.bankList = [];
  }

  async save(dto: any): Promise<number> {
    const newId = this.bankList.length + 1;
    this.bankList.push({ BANCO_ID: newId, ...dto });
    return newId;
  }

  async list(): Promise<any[]> {
    return this.bankList;
  }

  async remove(bankId: number): Promise<void> {
    this.bankList = this.bankList.filter((bank) => bank.BANCO_ID !== bankId);
  }

  async getById(bankId: number): Promise<any> {
    return this.bankList.find((bank) => bank.BANCO_ID === bankId);
  }

  async update(dto: any): Promise<void> {
    this.bankList = this.bankList.map((bank) => {
      if (bank.BANCO_ID === dto.id) {
        return {
          BANCO_ID: dto.id,
          CODIGO: dto.codigo ?? bank.CODIGO,
          NOME: dto.nome ?? bank.NOME,
          URL: dto.url ?? bank.URL,
        };
      }
      return bank;
    });
  }
}
