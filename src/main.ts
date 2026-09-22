import cors from "cors";
import express, { type Request, type Response } from "express";
import { BankRepositoryDatabase } from "./bank.repository-database.ts";
import { CreateBankUseCase } from "./create-bank.usecase.ts";
import { GetBankByIdUseCase } from "./get-bank-by-id.usecase.ts";
import { GetBankListUseCase } from "./get-bank-list.usecase.ts";
import { RemoveBankUseCase } from "./remove-bank.usecase.ts";
import { UpdateBankUseCase } from "./update-bank.usecase.ts";
import { NotFoundError } from "./not-found.error.ts";
import { DomainError } from "./domain-error.ts";
import { ApplicationError } from "./application-error.ts";

const app = express();

app.use(express.json());
app.use(cors());

const bankRepository = new BankRepositoryDatabase();

app.get("/banco", async (request: Request, response: Response) => {
  const useCase = new GetBankListUseCase(bankRepository);
  const output = await useCase.execute();
  try {
    return response.status(200).json(output);
  } catch (e: any) {
    return response.status(500).json({
      code: "SERVER_ERROR",
      message: "Internal server error",
    });
  }
});

app.get("/banco/:id", async (request: Request, response: Response) => {
  const bankId = Number(request.params.id);
  const input = { id: bankId };
  const useCase = new GetBankByIdUseCase(bankRepository);
  try {
    const output = await useCase.execute(input);
    response.status(200).json(output);
  } catch (e: any) {
    if (e instanceof NotFoundError)
      return response.status(404).json({
        code: e.code,
        message: e.message,
      });
    console.log(e);
    return response.status(500).json({
      code: "SERVER_ERROR",
      message: "Internal Server Error",
    });
  }
});

app.post("/banco", async (request: Request, response: Response) => {
  const input = request.body;
  const useCase = new CreateBankUseCase(bankRepository);
  try {
    const output = await useCase.execute(input);
    return response.status(201).json(output);
  } catch (e: any) {
    if (e instanceof DomainError) {
      return response.status(422).json({
        code: e.code,
        message: e?.message,
      });
    }
    return response.status(500).json({
      code: "SERVER_ERROR",
      message: "Internal server error",
    });
  }
});

app.put("/banco/:id", async (request: Request, response: Response) => {
  const bankData = request.body;
  const bankId = Number(request.params.id);
  const input = {
    id: bankId,
    ...bankData,
  };
  const useCase = new UpdateBankUseCase(bankRepository);
  try {
    const output = await useCase.execute(input);
    return response.status(200).json(output);
  } catch (e: any) {
    if (e instanceof NotFoundError) {
      return response.status(404).json({
        code: e.code,
        message: e?.message,
      });
    }
    if (e instanceof DomainError) {
      return response.status(422).json({
        code: e.code,
        message: e?.message,
      });
    }
    return response.status(500).json({
      code: "SERVER_ERROR",
      message: "Internal server error",
    });
  }
});

app.delete("/banco/:id", async (request: Request, response: Response) => {
  const bankId = Number(request.params.id);
  const useCase = new RemoveBankUseCase(bankRepository);
  const input = {
    id: bankId,
  };
  try {
    await useCase.execute(input);
    return response.status(200).end();
  } catch (e: any) {
    if (e instanceof ApplicationError) {
      return response.status(422).json({
        code: e.code,
        message: e?.message,
      });
    }
    return response.status(500).json({
      code: "SERVER_ERROR",
      message: "Internal server error",
    });
  }
});

app.listen(3001, () => {
  console.log("Server running at http://localhost:3001");
});
