import type { BankDAO } from "./bank.dao-database.ts";

export class CreateBankUseCase {
  constructor(private readonly bankDAO: BankDAO) {}

  async execute(input: any): Promise<any> {
    const bankId = await this.bankDAO.save(input);
    const output = {
      id: bankId,
      ...input,
    };
    return output;
  }
}
