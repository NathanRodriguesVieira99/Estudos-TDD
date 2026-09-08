import type { BankDAO } from "@/bank.dao-database.ts";
import { GetBankByIdUseCase } from "@/get-bank-by-id.usecase.ts";

import { BankDAOFake } from "../mocks/bank.dao.fake.ts";

let bankDAO: BankDAO;
let sut: GetBankByIdUseCase;

beforeAll(() => {
  bankDAO = new BankDAOFake();
  sut = new GetBankByIdUseCase(bankDAO);
});

test("Deve retornar um banco pelo ID", async () => {
  const inputCreate = {
    codigo: "559",
    nome: "Banco Teste Find One",
    url: "teste_find_one.com",
  };
  const bankId = await bankDAO.save(inputCreate);
  const inputSut = {
    id: bankId,
  };
  const output = await sut.execute(inputSut);
  expect(output?.id).toBe(bankId);
  expect(output?.codigo).toBe(inputCreate.codigo);
  expect(output?.nome).toBe(inputCreate.nome);
  expect(output?.url).toBe(inputCreate.url);
  await bankDAO.remove(bankId);
});
