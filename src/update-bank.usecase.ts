import type { BankDAO } from "./bank.dao-database.ts";

export class UpdateBankUseCase {
  constructor(private readonly bankDAO: BankDAO) {}

  async execute(input: any) {
    const row = await this.bankDAO.getById(Number(input.id));
    const updatedBank = {
      ...row,
      ...input,
    };
    await this.bankDAO.update(updatedBank);
    return updatedBank;
  }
}
