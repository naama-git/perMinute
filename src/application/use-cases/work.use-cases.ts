
import type { Work } from '../../domain/work';
import type { WorkRepository } from '../ports/work.repository';
import { normalizeDomain } from '../../utils/domain-matching';

interface CreateWorkInput {
  name: string;
  websiteDomains: string[];
}

interface UpdateWorkInput {
  id: string;
  name?: string;
  websiteDomains?: string[];
}

interface WorkDependencies {
  workRepository: WorkRepository;
}

function normalizeDomains(domains: string[]): string[] {
  const normalized = domains.map(normalizeDomain);

  if (normalized.some((domain) => domain === null)) {
    throw new Error('One or more domains are invalid');
  }

  return [...new Set(normalized as string[])];
}

// Create Work
export function createWork({ workRepository }: WorkDependencies) {
  return async (input: CreateWorkInput): Promise<Work> => {
    const name = input.name.trim();

    if (!name) {
      throw new Error('Work name is required');
    }

    const work: Work = {
      id: crypto.randomUUID(),
      name,
      websiteDomains: normalizeDomains(input.websiteDomains),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      archivedAt: null,
    };

    await workRepository.save(work);

    return work;
  };
}

// Update Work
export function updateWork({ workRepository }: WorkDependencies) {
  return async (input: UpdateWorkInput): Promise<Work> => {
    const work = await workRepository.findById(input.id);

    if (!work) {
      throw new Error('Work not found');
    }

    if (work.archivedAt !== null) {
      throw new Error('Cannot update an archived Work');
    }

    const updatedWork: Work = {
      ...work,
      name: input.name !== undefined
        ? input.name.trim()
        : work.name,
      websiteDomains: input.websiteDomains !== undefined
        ? normalizeDomains(input.websiteDomains)
        : work.websiteDomains,
      updatedAt: Date.now(),
    };

    if (!updatedWork.name) {
      throw new Error('Work name is required');
    }

    await workRepository.save(updatedWork);

    return updatedWork;
  };
}

// Archive Work
export function archiveWork({ workRepository }: WorkDependencies) {
  return async (id: string): Promise<void> => {
    const work = await workRepository.findById(id);

    if (!work) {
      throw new Error('Work not found');
    }

    if (work.archivedAt !== null) {
      return;
    }

    const archivedWork: Work = {
      ...work,
      archivedAt: Date.now(),
      updatedAt: Date.now(),
    };

    await workRepository.save(archivedWork);
  };
}
