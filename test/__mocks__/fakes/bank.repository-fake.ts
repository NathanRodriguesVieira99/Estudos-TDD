import type { BankRepository } from "@/bank.repository-database.ts";
import { Bank } from "@/bank.ts";

export class BankRepositoryFake implements BankRepository {
  private bankList: Bank[] = [];

  async save(bank: Bank): Promise<Bank> {
    const id = this.bankList.length + 1;
    const createdBank = Bank.restore({
      id,
      name: bank.getName(),
      code: bank.getCode(),
      url: bank.getUrl(),
    });
    this.bankList.push(createdBank);
    return createdBank;
  }

  async list(): Promise<Bank[]> {
    return this.bankList;
  }

  async remove(bankId: number): Promise<void> {
    this.bankList = this.bankList.filter((bank) => bank.getId() !== bankId);
  }

  async findById(bankId: number): Promise<Bank | undefined> {
    return this.bankList.find((bank) => bank.getId() === bankId);
  }

  async findByCode(code: string): Promise<Bank | undefined> {
    return this.bankList.find((bank) => bank.getCode() === code);
  }

  async findByName(name: string): Promise<Bank | undefined> {
    return this.bankList.find((bank) => bank.getName() === name);
  }

  async update(updatedBank: Bank): Promise<void> {
    this.bankList = this.bankList.map((bank) => {
      if (bank.getId() === updatedBank.getId()) {
        Bank.restore({
          id: updatedBank.getId(),
          name: updatedBank.getName(),
          code: updatedBank.getCode(),
          url: updatedBank.getUrl(),
        });
      }
      return bank;
    });
  }
}
