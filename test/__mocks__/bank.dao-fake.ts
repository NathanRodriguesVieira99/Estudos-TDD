import type { BankDAO } from "@/bank.dao-database.ts";

export class BankDAOFake implements BankDAO {
  private bankList: BankDAO.BankDTO[];

  constructor() {
    this.bankList = [];
  }

  async save(dto: BankDAO.SaveDTO): Promise<number> {
    const newId = this.bankList.length + 1;
    this.bankList.push({
      banco_id: newId,
      codigo: dto.codigo,
      nome: dto.nome,
      url: dto.url,
    });
    return newId;
  }

  async list(): Promise<BankDAO.BankDTO[]> {
    return this.bankList;
  }

  async remove(bankId: number): Promise<void> {
    this.bankList = this.bankList.filter((bank) => bank.banco_id !== bankId);
  }

  async getById(bankId: number): Promise<BankDAO.BankDTO | undefined> {
    return this.bankList.find((bank) => bank.banco_id === bankId);
  }

  async getByCode(code: string): Promise<BankDAO.BankDTO | undefined> {
    return this.bankList.find((bank) => bank.codigo === code);
  }

  async getByName(name: string): Promise<BankDAO.BankDTO | undefined> {
    return this.bankList.find((bank) => bank.nome === name);
  }

  async update(dto: BankDAO.UpdateDTO): Promise<void> {
    this.bankList = this.bankList.map((bank) => {
      if (bank.banco_id === dto.id) {
        return {
          banco_id: dto.id,
          codigo: dto.codigo ?? bank.codigo,
          nome: dto.nome ?? bank.nome,
          url: dto.url ?? bank.url,
        };
      }
      return bank;
    });
  }
}
