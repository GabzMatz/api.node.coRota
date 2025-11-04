import { Request, Response } from "express";
import { CompanyService } from "../services/companies.service.js";
import { SearchCompany } from "../models/company.model.js";

export class CompanyController {

  public static async getAll(req: Request, res: Response) {
    res.status(200).send(await new CompanyService().getAll());
  }

  public static async getById(req: Request, res: Response) {
    const companyId = req.params.id;
    res.status(200).send(await new CompanyService().getById(companyId));
  }

  public static async create(req: Request, res: Response) {
    await new CompanyService().create(req.body);

    res.status(201).send({
      message: "Empresa criada com sucesso!"
    });
  }

  public static async update(req: Request, res: Response) {
    const companyId = req.params.id;
    await new CompanyService().update(companyId, req.body);

    res.status(201).send({
      message: "Empresa atualizada com sucesso!"
    });
  }

  public static async search(req: Request, res: Response) {
    const search = req.body as SearchCompany;

    const data = await new CompanyService().search(search);

    res.status(200).send({ data });
  }

  public static async delete(req: Request, res: Response) {
    await new CompanyService().delete(req.params.id);
    res.status(204).end();
  }
}
