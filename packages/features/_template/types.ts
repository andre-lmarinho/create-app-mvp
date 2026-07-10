// The shapes this slice exposes to its consumers, plus slice-private inputs.
//
// Expose only the fields consumers need — never a raw Prisma row (see
// data-repository-pattern.md).

export interface YourDomain {
  id: string;
  name: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

export interface YourDomainWithChildren extends YourDomain {
  children: Array<{ id: string; name: string }>;
}

export interface CreateYourDomainInput {
  name: string;
  status?: "active" | "inactive";
}

// Repository query input — stays inside the slice.
export interface YourDomainListFilter {
  status?: "active" | "inactive";
  limit?: number;
}
