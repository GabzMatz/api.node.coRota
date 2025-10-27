import { NotFoundError } from "../errors/not-found.error.js";
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

    _user.corporateEmail = user.corporateEmail;
    _user.cpf = user.cpf;
    _user.updatedAt = new Date();
    _user.firstName = user.firstName;
    _user.lastName = user.lastName;
    _user.phone = user.phone;
    _user.companyId = user.companyId;
    _user.addressId = user.addressId;
    _user.workSchedule = user.workSchedule;
    _user.hasCar = user.hasCar;
    
    await this.authService.update(userId, user);
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