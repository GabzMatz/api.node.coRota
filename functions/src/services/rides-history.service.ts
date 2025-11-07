import { NotFoundError } from "../errors/not-found.error.js";
import { RidesHistory, RideStatus, RidesHistoryDto } from "../models/rides-history.model.js";
import { RidesHistoryRepository } from "../repositories/rides-history.repository.js";
import { Ride, RideDto } from "../models/ride.model.js";
import { Timestamp } from "firebase-admin/firestore";

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

  public async getAll(): Promise<RidesHistoryDto[]> {
    const histories = await this.ridesHistoryRepository.getAll();
    return histories.map(history => this.formatRideHistoryForFrontend(history));
  }

  public async getById(id: string): Promise<RidesHistoryDto> {
    const rideHistory = await this.getByIdInternal(id);

    return this.formatRideHistoryForFrontend(rideHistory);
  }

  public async create(rideHistory: RidesHistory): Promise<void> {
    rideHistory.createdAt = new Date();
    await this.ridesHistoryRepository.create(rideHistory);
  }

  public async update(id: string, rideHistory: RidesHistory): Promise<void> {
    const _rideHistory = await this.getByIdInternal(id);
    
    _rideHistory.updatedAt = new Date();
    _rideHistory.isActive = rideHistory.isActive;
    _rideHistory.userId = rideHistory.userId;
    _rideHistory.rideId = rideHistory.rideId;
    _rideHistory.status = rideHistory.status;
    _rideHistory.role = rideHistory.role;
        
    await this.ridesHistoryRepository.update(id, _rideHistory);
  }

  public async getByUserId(userId: string): Promise<RidesHistoryDto[]> {    
    const ridesHistory = await this.ridesHistoryRepository.getRidesHistoryByUserId(userId);

    return ridesHistory.map(history => this.formatRideHistoryForFrontend(history));
  }

  public async cancelDriverRide(rideId: string): Promise<void> {
    const histories = await this.ridesHistoryRepository.getRidesHistoryByRideId(rideId);

    const updatedAt = new Date();

    for (const history of histories) {
      history.updatedAt = updatedAt;
      history.status = RideStatus.CANCELED;
      history.isActive = false;

      await this.ridesHistoryRepository.update(history.id, history);
    }
  }

  private formatRideHistoryForFrontend(history: RidesHistory): RidesHistoryDto {
    return {
      ...history,
      ride: history.ride ? this.formatRideForFrontend(history.ride) : null,
    };
  }

  private formatRideForFrontend(ride: Ride): RideDto {
    return {
      ...ride,
      date: this.normalizeDateToString(ride.date),
    };
  }

  private normalizeDateToString(date: Timestamp | Date | string): string {
    let dateObj: Date;

    if (date instanceof Timestamp) {
      dateObj = date.toDate();
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      dateObj = new Date(date);
    }

    const year = dateObj.getUTCFullYear();
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getUTCDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  public async cancelUserRide(rideId: string, userId: string): Promise<void> {  
    const _rideHistory = await this.ridesHistoryRepository.getRidesHistoryByUserAndRideId(userId, rideId);
    
    _rideHistory.updatedAt = new Date();
    _rideHistory.status = RideStatus.CANCELED;
    _rideHistory.isActive = false;
        
    await this.ridesHistoryRepository.update(_rideHistory.id, _rideHistory);
  }

  private async getByIdInternal(id: string): Promise<RidesHistory> {
    const rideHistory = await this.ridesHistoryRepository.getById(id);

    if (!rideHistory) {
      throw new NotFoundError("Histórico não encontrado!");
    }

    return rideHistory;
  }

}
