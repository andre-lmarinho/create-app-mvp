import type { PrismaClient } from "@repo/database/generated/prisma/client";
import type { CreateYourDomainDto, YourDomainDto, YourDomainWithChildrenDto } from "../types";

// Scaffold shim: the `yourDomain` model isn't on PrismaClient until you add it to
// schema.prisma and run `pnpm db:generate`. We assert the delegate here so the template
// type-checks while the rest of the file — and its callers — stay fully checked. Once the
// model is real, delete this shim and the cast, and type `db` as plain PrismaClient; the
// query bodies then get Prisma's own type-checking.
type YourDomainDelegate = {
  findUnique(args: object): Promise<YourDomainWithChildrenDto | null>;
  findMany(args: object): Promise<YourDomainWithChildrenDto[]>;
  create(args: object): Promise<YourDomainWithChildrenDto>;
};
type ScaffoldDb = PrismaClient & { yourDomain: YourDomainDelegate };

export class YourDomainRepository {
  private readonly db: ScaffoldDb;

  constructor(db: PrismaClient) {
    this.db = db as ScaffoldDb;
  }

  // Returns null when absent — the service decides whether that becomes NOT_FOUND.
  async findById(id: string): Promise<YourDomainDto | null> {
    return this.db.yourDomain.findUnique({
      where: { id },
      select: { id: true, name: true, status: true, createdAt: true, updatedAt: true },
    });
  }

  async fetchAll(limit?: number): Promise<YourDomainDto[]> {
    return this.db.yourDomain.findMany({
      take: limit,
      select: { id: true, name: true, status: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async fetchAllWithChildren(): Promise<YourDomainWithChildrenDto[]> {
    return this.db.yourDomain.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        children: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: CreateYourDomainDto): Promise<YourDomainDto> {
    return this.db.yourDomain.create({
      data: {
        name: data.name,
        status: data.status ?? "active",
      },
      select: { id: true, name: true, status: true, createdAt: true, updatedAt: true },
    });
  }
}
