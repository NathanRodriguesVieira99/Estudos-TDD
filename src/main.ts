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
import { MySQLAdapter } from "./mysql.adapter.ts";

/*
 * Composition Root (geralmente o main.ts) é o único ponto da aplicacao onde todas as dependencias são reunidas, instanciadas e injetadas.
 * Serve como um ponto único de entrada que centraliza a injeção de dependencias, assim, desacoplando e isolando o restante do código.
 */

/*
 * Dependency Rule: As dependencias do código só podem apontar para dentro.
 * As camadas mais externas (Banco de dados por exemplo) conhecem as camadas internas (Entities e UseCases), mas as internas nunca conhecem as externas.
 */

const app = express();

app.use(express.json());
app.use(cors());

/*
 * DIP (Dependency Inversion Principle)
 * Os módulos de alto nível (Domain e Application) não devem depender de módulos de baixo nível (Interface Adapters e Frameworks & Drivers), ambos devem depender de abstrações (interfaces).
 * Os módulos de alto nível por meio das interfaces (portas/contratos) obrigam os módulos de baixo nível a se adaptarem a eles.
 */

//*   instancia            injeção de dependência
const databaseConnection = new MySQLAdapter(String(process.env.DATABASE_URL));
const bankRepository = new BankRepositoryDatabase(databaseConnection);

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
