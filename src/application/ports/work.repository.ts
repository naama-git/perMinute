
import type { Work } from '../../domain/work';

export interface WorkRepository {
  findAll(): Promise<Work[]>;
  findById(id: string): Promise<Work | null>;
  save(work: Work): Promise<void>;
}
