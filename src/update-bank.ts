import { BankDAO } from "./bank.dao.ts";

export const updateBank = async (input: any) => {
  const bankDAO = new BankDAO()
  
  const row = await bankDAO.getById(input.id);
  const output = {
    id: row.BANCO_ID,
    codigo: row.CODIGO,
    nome: row.NOME,
    url: row.URL,
  };
  const updatedBank = {
    ...output,
    ...input,
  };
  await bankDAO.update(updatedBank);
  return updatedBank;
};
