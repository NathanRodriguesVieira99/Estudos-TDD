import cors from "cors";
import express, { type Request, type Response } from "express";

import { BankDAODatabase } from "./bank.dao-database.ts";
import { GetBankByIdUseCase } from "./get-bank-by-id.usecase.ts";
import { GetBankListUseCase } from "./get-bank-list.usecase.ts";
import { UpdateBankUseCase } from "./update-bank.usecase.ts";

const app = express();

app.use(express.json());
app.use(cors());

const bankDAO = new BankDAODatabase();

app.get("/banco", async (request: Request, response: Response) => {
  const useCase = new GetBankListUseCase(bankDAO);
  const output = await useCase.execute();
  response.status(200).json(output);
});

app.get("/banco/:id", async (request: Request, response: Response) => {
  const bankId = request.params.id;
  const input = { id: bankId };
  const useCase = new GetBankByIdUseCase(bankDAO);
  const output = await useCase.execute(input);
  if (!output) return response.status(404).end();
  response.status(200).json(output);
});

app.post("/banco", async (request: Request, response: Response) => {
  const bankData = request.body;
  const bankId = await bankDAO.save(bankData);
  const bank = {
    id: bankId,
    ...bankData,
  };
  response.status(201).json(bank);
});

app.put("/banco/:id", async (request: Request, response: Response) => {
  const bankData = request.body;
  const bankId = request.params.id;
  const input = {
    id: Number(bankId),
    ...bankData,
  };
  const useCase = new UpdateBankUseCase(bankDAO);
  const output = await useCase.execute(input);
  response.status(200).json(output);
});

app.delete("/banco/:id", async (request: Request, response: Response) => {
  const bankId = request.params.id;
  await bankDAO.remove(Number(bankId));
  response.status(200).end();
});

app.listen(3001, () => {
  console.log("Server running at http://localhost:3001");
});
