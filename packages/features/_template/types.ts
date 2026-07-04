// DTO naming convention (see data-dto-boundaries.md):
//   {Entity}Dto              — Base DTO
//   {Entity}With{Relation}Dto — DTO with eager-loaded relations
//   Create{Entity}Dto         — Input DTO for creation
//
// Use string literal unions (not Prisma enums) for status/type fields.
// Never re-export Prisma-generated types to consumers.

export interface YourDomainDto {
  id: string;
  name: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

export interface YourDomainWithChildrenDto extends YourDomainDto {
  children: Array<{ id: string; name: string }>;
}

export interface CreateYourDomainDto {
  name: string;
  status?: "active" | "inactive";
}
