import { NotFoundError } from "../errors/not-found.error.js";
import { ValidationError } from "../errors/validation.error.js";
import { User } from "../models/user.model.js";
import { UserRepository } from "../repositories/user.repository.js";
import { AuthService } from "./auth.service.js";

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
    const userAuth = await this.authService.create(user);
    user.id = userAuth.uid;
    user.createdAt = new Date();
    user.updatedAt = new Date();

    await this.userRepository.update(userAuth.uid, user);
    await this.authService.verifyEmail(user.corporateEmail);
  }

  public async update(userId: string, user: User): Promise<void> {
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

    if (typeof user.carInfo === "string") {
      _user.carInfo = user.carInfo;
      _user.hasCar = user.carInfo.trim().length > 0;

      if (!_user.hasCar) {
        delete _user.carSeats;
      }
    }

    if (typeof user.carSeats !== "undefined") {
      if (user.carSeats < 2) {
        throw new ValidationError("A quantidade de lugares do veículo deve ser no mínimo 2.");
      }
      _user.carSeats = user.carSeats;
      _user.hasCar = true;
    }

    if (_user.hasCar && (!_user.carInfo || _user.carInfo.trim().length === 0 || !_user.carSeats || _user.carSeats < 2)) {
      throw new ValidationError("Para cadastrar um veículo, informe os dados do veículo e a quantidade de lugares.");
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
}