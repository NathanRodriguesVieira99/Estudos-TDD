import type { BankDAO } from "@/bank.dao-database.ts";
import { RemoveBankUseCase } from "@/remove-bank.usecase.ts";

import { BankDAOFake } from "../mocks/fakes/bank.dao.fake.ts";

let bankDAO: BankDAO;
let sut: RemoveBankUseCase;

beforeAll(() => {
  bankDAO = new BankDAOFake();
  sut = new RemoveBankUseCase(bankDAO);
});

test("Deve deletar um banco ", async () => {
  const inputCreate = {
    codigo: "556",
    nome: "Banco Teste Delete",
    url: "teste_delete.com",
  };
  const bankId = await bankDAO.save(inputCreate);
  const inputSut = {
    id: bankId,
  };
  await sut.execute(inputSut);
  const bankExists = await bankDAO.getById(bankId);
  expect(bankExists?.BANCO_ID).toBeFalsy();
});
