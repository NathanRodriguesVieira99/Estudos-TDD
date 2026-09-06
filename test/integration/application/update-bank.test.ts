import { getById, remove, save } from "@/database.ts";
import { updateBank } from "@/update-bank.ts";

test("Deve alterar um banco", async () => {
  const inputCreate = {
    codigo: "553",
    nome: "Banco Teste",
    url: "teste.com",
  };
  const bankId = await save(inputCreate);
  const inputUpdate = {
    id: bankId,
    codigo: "553",
    nome: "Banco Teste 2",
    url: "teste2.com",
  };
  const outputUpdate = await updateBank(inputUpdate);
  expect(outputUpdate.id).toBe(bankId);
  expect(outputUpdate.codigo).toBe(inputUpdate.codigo);
  expect(outputUpdate.nome).toBe(inputUpdate.nome);
  expect(outputUpdate.url).toBe(inputUpdate.url);
  const outputGet = await getById(bankId);
  expect(outputGet).toBeTruthy();
  expect(outputGet.BANCO_ID).toBe(bankId);
  expect(outputGet.CODIGO).toBe(inputUpdate.codigo);
  expect(outputGet.NOME).toBe(inputUpdate.nome);
  expect(outputGet.URL).toBe(inputUpdate.url);
  await remove(bankId);
});
