import type { BankDAO } from "./bank.dao-database.ts";

export class RemoveBankUseCase {
  constructor(private readonly bankDAO: BankDAO) {}

  async execute(input: any): Promise<any> {
    await this.bankDAO.remove(Number(input.id));
  }
}
