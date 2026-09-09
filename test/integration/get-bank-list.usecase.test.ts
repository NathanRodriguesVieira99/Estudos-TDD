import { type BankDAO } from "@/bank.dao-database.ts";
import { GetBankListUseCase } from "@/get-bank-list.usecase.ts";

import { BankDAOFake } from "../mocks/fakes/bank.dao.fake.ts";

let bankDAO: BankDAO;
let sut: GetBankListUseCase;

beforeAll(() => {
  bankDAO = new BankDAOFake();
  sut = new GetBankListUseCase(bankDAO);
});

test("Deve retornar a lista de bancos", async () => {
  const inputCreate = {
    codigo: "559",
    nome: "Banco Teste List",
    url: "teste_list.com",
  };
  const bankId = await bankDAO.save(inputCreate);
  const output = await sut.execute();
  expect(output).toBeInstanceOf(Array);
  expect(output.length).toBeGreaterThanOrEqual(1);
  const bankData = output.find((bank) => bank.id === bankId);
  expect(bankData).toBeTruthy();
  expect(bankData?.id).toBe(bankId);
  expect(bankData?.codigo).toBe(inputCreate.codigo);
  expect(bankData?.nome).toBe(inputCreate.nome);
  expect(bankData?.url).toBe(inputCreate.url);
  await bankDAO.remove(bankId);
});
