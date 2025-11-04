import { NotFoundError } from "../errors/not-found.error.js";
import { Company, SearchCompany } from "../models/company.model.js";
import { CompaniesRepository } from "../repositories/companies.repository.js";

export class CompanyService {
  constructor() {
    this.companiesRepository = new CompaniesRepository();
  }
  
  private companiesRepository: CompaniesRepository;

  public async getAll(): Promise<Company[]> {
    return await this.companiesRepository.getAll();
  }

  public async getById(id: string): Promise<Company> {
    const company = await this.companiesRepository.getById(id);

    if (!company) {
        throw new NotFoundError("Empresa não encontrada!");
    }

    return company;
  }

  public async create(company: Company): Promise<void> {
    company.createdAt = new Date();
    await this.companiesRepository.create(company);
  }

  public async update(id: string, company: Company): Promise<void> {
    const _company = await this.getById(id);
    
    _company.updatedAt = new Date();
    _company.isActive = company.isActive;
    _company.name = company.name;
    _company.addressId = company.addressId;
    _company.usersEmails = company.usersEmails;
        
    await this.companiesRepository.update(id, _company);
  }

  public async search(search: SearchCompany): Promise<Company[]> {
    const allCompanies = await this.getAll();

    if (!search.name || search.name.trim() === '') 
      return allCompanies;

    const filteredCompanies = allCompanies.filter(company =>
      company.name.toLowerCase().includes(search.name.toLowerCase())
    );

    if (filteredCompanies.length === 0) 
      return [];
    
    return filteredCompanies;
  }

  public async delete(companyId: string): Promise<void> {
    const company = await this.getById(companyId);

    if (!company) {
      throw new NotFoundError("Não foi possível deletar a empresa!");
    }

    await this.companiesRepository.delete(companyId);
  }
}
