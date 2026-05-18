import { NotFoundError } from "../errors/not-found.error.js";
import { ValidationError } from "../errors/validation.error.js";
import { User, VehicleType } from "../models/user.model.js";
import { UserRepository } from "../repositories/user.repository.js";
import { AuthService } from "./auth.service.js";
import { isValidBrazilianLicensePlate } from "../utils/license-plate.js";

export class UserService {
  constructor() {
    this.userRepository = new UserRepository();
    this.authService = new AuthService();
  }

  private authService: AuthService;
  private userRepository: UserRepository;

  public async getAll(): Promise<User[]> {
    return await this.userRepository.getAll();
  }

  public async getById(userId: string): Promise<User> {
    const user = await this.userRepository.getById(userId);

    if (!user) {
      throw new NotFoundError("Usuário não encontrado!");
    }

    return user;
  }

  public async create(user: User): Promise<void> {
    if (user.hasCar && user.carInfo) {
      this.assertValidVehiclePayload(user.carInfo, user.carSeats, user.vehicleType);
    }

    const userAuth = await this.authService.create(user);
    user.id = userAuth.uid;
    user.createdAt = new Date();
    user.updatedAt = new Date();

    await this.userRepository.update(userAuth.uid, user);
    await this.authService.verifyEmail(user.corporateEmail);
  }

  public async update(userId: string, user: Partial<User> & { clearVehicle?: boolean }): Promise<void> {
    const _user = await this.userRepository.getById(userId);

    if (!_user) {
      throw new NotFoundError("Não foi possível atualizar o usuário!");
    }

    _user.updatedAt = new Date();

    if (typeof user.phone === "string") {
      _user.phone = user.phone;
    }

    if (typeof user.photo === "string") {
      _user.photo = user.photo;
    }

    if (user.clearVehicle === true) {
      _user.carInfo = "";
      _user.hasCar = false;
      delete _user.carSeats;
      delete _user.vehicleType;
    } else {
      if (typeof user.vehicleType === "string") {
        _user.vehicleType = user.vehicleType as VehicleType;
      }

      if (typeof user.carInfo === "string") {
        _user.carInfo = user.carInfo;
        _user.hasCar = user.carInfo.trim().length > 0;

        if (!_user.hasCar) {
          delete _user.carSeats;
          delete _user.vehicleType;
        }
      }

      if (typeof user.carSeats !== "undefined") {
        _user.carSeats = user.carSeats;
        if (user.carSeats > 0) {
          _user.hasCar = true;
        }
      }
    }

    if (_user.hasCar) {
      this.assertValidVehiclePayload(_user.carInfo, _user.carSeats, _user.vehicleType);
    }

    await this.userRepository.update(userId, _user);
  }

  public async delete(userId: string): Promise<void> {
    const user = await this.userRepository.getById(userId);

    if (!user) {
      throw new NotFoundError("Não foi possível deletar o usuário!");
    }

    await this.authService.delete(userId);
    await this.userRepository.delete(userId);
  }

  private assertValidVehiclePayload(
    carInfo: string,
    carSeats?: number,
    vehicleType?: VehicleType
  ): void {
    if (!carInfo || carInfo.trim().length === 0) {
      throw new ValidationError("Para cadastrar um veículo, informe os dados do veículo.");
    }

    const plateMatch = carInfo.match(/Placa:\s*([^|]+)/i);
    const plate = plateMatch?.[1]?.trim() || "";
    if (!plate || !isValidBrazilianLicensePlate(plate)) {
      throw new ValidationError("Placa inválida. Use o padrão antigo (ABC1234) ou Mercosul (ABC1D23).");
    }

    const type = vehicleType || "car";
    const seats = Number(carSeats ?? 0);
    if (type === "motorcycle") {
      if (seats < 1 || seats > 2) {
        throw new ValidationError("Motos permitem de 1 a 2 lugares (incluindo o condutor).");
      }
      return;
    }

    if (seats < 2 || seats > 8) {
      throw new ValidationError("Carros permitem de 2 a 8 lugares.");
    }
  }
}
