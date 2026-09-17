import { Bank } from "@/bank.ts";

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

export class BankRepositoryDatabase {}
