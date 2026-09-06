import { getById, update } from "./database.ts";

export const updateBank = async (input: any) => {
  const row = await getById(input.id);
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
  await update(updatedBank);
  return updatedBank;
};
