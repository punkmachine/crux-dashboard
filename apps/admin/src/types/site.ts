export interface Site {
  id: string;
  url: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSiteDto {
  url: string;
  name: string;
  isActive?: boolean;
}

export interface UpdateSiteDto {
  name?: string;
  isActive?: boolean;
}
