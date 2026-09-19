export interface Material {
  id: number;
  name: string;
  unit: string;
  description: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface CreateMaterialDto {
  name: string;
  unit: string;
  description?: string;
}

export interface UpdateMaterialDto {
  name: string;
  unit: string;
  description: string | null;
}
