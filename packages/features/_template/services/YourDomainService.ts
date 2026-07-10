import { ApplicationError } from "@repo/lib/errors";
import type { YourDomainRepository } from "../repositories/YourDomainRepository";
import type { CreateYourDomainInput, YourDomain } from "../types";

export class YourDomainService {
  constructor(private readonly repo: YourDomainRepository) {}

  // Canonical pattern: repo returns null, the service turns it into an ApplicationError
  // that errorConversionMiddleware maps to a TRPCError.
  async findById(id: string): Promise<YourDomain> {
    const entity = await this.repo.findById(id);

    if (!entity) {
      throw new ApplicationError("NOT_FOUND", `YourDomain [${id}] not found`);
    }

    return entity;
  }

  async create(data: CreateYourDomainInput): Promise<YourDomain> {
    if (data.name.trim().length < 2) {
      throw new ApplicationError("BAD_REQUEST", "Name must be at least 2 characters");
    }

    return this.repo.create(data);
  }
}
