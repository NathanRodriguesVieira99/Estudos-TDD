import cors from "cors";
import express, { type Request, type Response } from "express";

import { BankDAODatabase } from "./bank.dao-database.ts";
import { CreateBankUseCase } from "./create-bank.usecase.ts";
import { GetBankByIdUseCase } from "./get-bank-by-id.usecase.ts";
import { GetBankListUseCase } from "./get-bank-list.usecase.ts";
import { RemoveBankUseCase } from "./remove-bank.usecase.ts";
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
  const bankId = Number(request.params.id);
  const input = { id: bankId };
  const useCase = new GetBankByIdUseCase(bankDAO);
  const output = await useCase.execute(input);
  if (!output) return response.status(404).end();
  response.status(200).json(output);
});

app.post("/banco", async (request: Request, response: Response) => {
  const input = request.body;
  const useCase = new CreateBankUseCase(bankDAO);
  try {
    const output = await useCase.execute(input);
    return response.status(201).json(output);
  } catch (error: any) {
    return response.status(422).json({ message: error?.message });
  }
});

app.put("/banco/:id", async (request: Request, response: Response) => {
  const bankData = request.body;
  const bankId = Number(request.params.id);
  const input = {
    id: bankId,
    ...bankData,
  };
  const useCase = new UpdateBankUseCase(bankDAO);
  try {
    const output = await useCase.execute(input);
    return response.status(200).json(output);
  } catch (error: any) {
    if (error?.message === "Banco não encontrado") {
      return response.status(404).json({ message: error?.message });
    }
    return response.status(422).json({ message: error?.message });
  }
});

app.delete("/banco/:id", async (request: Request, response: Response) => {
  const bankId = Number(request.params.id);
  const useCase = new RemoveBankUseCase(bankDAO);
  const input = {
    id: bankId,
  };
  await useCase.execute(input);
  response.status(200).end();
});

app.listen(3001, () => {
  console.log("Server running at http://localhost:3001");
});
