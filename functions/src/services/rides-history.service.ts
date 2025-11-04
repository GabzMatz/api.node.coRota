import { NotFoundError } from "../errors/not-found.error.js";
import { RidesHistory, RideStatus } from "../models/rides-history.model.js";
import { RidesHistoryRepository } from "../repositories/rides-history.repository.js";

export class RidesHistoryService {
  
  constructor(
    private ridesHistoryRepository = new RidesHistoryRepository()
  ) { }
  
  public async completeRideHistories(rideId: string): Promise<void> {
    const histories = (await this.ridesHistoryRepository.getRidesHistoryByRideId(rideId)).filter(h => h.status !== RideStatus.CANCELED);

    for (const history of histories) {
      history.status = RideStatus.COMPLETED;
      history.isActive = false;
      history.updatedAt = new Date();
      await this.ridesHistoryRepository.update(history.id, history);
    }
  }

  public async getAll(): Promise<RidesHistory[]> {
    return await this.ridesHistoryRepository.getAll();
  }

  public async getById(id: string): Promise<RidesHistory> {
    const rideHistory = await this.ridesHistoryRepository.getById(id);

    if (!rideHistory) {
        throw new NotFoundError("Histórico não encontrado!");
    }

    return rideHistory;
  }

  public async create(rideHistory: RidesHistory): Promise<void> {
    rideHistory.createdAt = new Date();
    await this.ridesHistoryRepository.create(rideHistory);
  }

  public async update(id: string, rideHistory: RidesHistory): Promise<void> {
    const _rideHistory = await this.getById(id);
    
    _rideHistory.updatedAt = new Date();
    _rideHistory.isActive = rideHistory.isActive;
    _rideHistory.userId = rideHistory.userId;
    _rideHistory.rideId = rideHistory.rideId;
    _rideHistory.status = rideHistory.status;
    _rideHistory.role = rideHistory.role;
        
    await this.ridesHistoryRepository.update(id, _rideHistory);
  }

  public async getByUserId(userId: string): Promise<RidesHistory[]> {    
    const ridesHistory = await this.ridesHistoryRepository.getRidesHistoryByUserId(userId);

    return ridesHistory;
  }

  public async cancelDriverRide(rideId: string, userId: string): Promise<void> {    
    const rideHistory = await this.ridesHistoryRepository.getRidesHistoryByUserAndRideId(userId, rideId);
    
    rideHistory.updatedAt = new Date();
    rideHistory.status = RideStatus.CANCELED;
        
    await this.ridesHistoryRepository.update(rideHistory.id, rideHistory);
    rideHistory.ride.passengerIds?.forEach(async id => {
      await this.cancelUserRide(rideId, id);
    })
  }

  public async cancelUserRide(rideId: string, userId: string): Promise<void> {    
    const _rideHistory = await this.ridesHistoryRepository.getRidesHistoryByUserAndRideId(userId, rideId);
    
    _rideHistory.updatedAt = new Date();
    _rideHistory.status = RideStatus.CANCELED;
        
    await this.ridesHistoryRepository.update(_rideHistory.id, _rideHistory);
  }

}
