import { NotFoundError } from "../errors/not-found.error.js";
import { AddressRepository } from "../repositories/address.repository.js";
import { Address } from "../models/address.model.js";

export class AddressService {
  constructor() {
    this.addressRepository = new AddressRepository();
  }
  
  private addressRepository: AddressRepository;

  public async getAll(): Promise<Address[]> {
    return await this.addressRepository.getAll();
  }

  public async getById(id: string): Promise<Address> {
    const address = await this.addressRepository.getById(id);

    if (!address) {
        throw new NotFoundError("Endereço não encontrado!");
    }

    return address;
  }

  public async create(address: Address): Promise<void> {
    await this.addressRepository.create(address);
  }

  public async update(id: string, address: Address): Promise<void> {
    const _address = await this.getById(id);
    
    _address.updatedAt = new Date();
    _address.createdAt = address.createdAt;
    _address.isActive = address.isActive;
    _address.street = address.street;
    _address.number = address.number;
    _address.neighborhood = address.neighborhood;
    _address.city = address.city;
    _address.state = address.state;
    _address.zipCode = address.zipCode;
    _address.lat = address.lat;
    _address.long = address.long;
    _address.complement = address.complement;
        
    await this.addressRepository.update(_address);
  }

}
