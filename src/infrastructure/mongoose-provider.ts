import { Model } from "mongoose";

export default class MongooseProvider<T> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  public async findOne(filter: object): Promise<T | null> {
    return this.model.findOne(filter);
  }

  async update(id: string, update: any): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async save(data: object): Promise<T | null> {
    return this.model.create(data);
  }

  async findByIdAndUpdate(_id: string, data: object): Promise<T | null> {
    return this.model.findByIdAndUpdate(_id, data);
  }

  deleteMany(filter: {}) {
    return this.model.deleteMany(filter);
  }

  async findOneAndRemove(filter: object): Promise<T | null> {
    return this.model.findOneAndRemove(filter);
  }
  // Add additional methods for other actions as needed
}
