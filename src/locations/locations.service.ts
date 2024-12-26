import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly repo: TreeRepository<Location>,
  ) {}

  async create(createLocationDto: CreateLocationDto) {
    const instance = this.repo.create({
      ...createLocationDto,
      parent: await this.getParent(createLocationDto.parentId),
    });
    await this.repo.save(instance);
    return instance;
  }

  async findAll() {
    const data = await this.repo.findTrees();
    return this.flattenLocationTree(data);
  }

  async countChildren(parentId: string) {
    return this.repo.count({
      where: {
        parentId,
      },
    });
  }

  async findOne(id: string) {
    return this.repo.findOneBy({ id });
  }

  async update(id: string, updateLocationDto: UpdateLocationDto) {
    const instance = await this.repo.findOneBy({ id });
    if (!instance) return null;
    const updatedInstance = this.repo.merge(instance, updateLocationDto, {
      parent: await this.getParent(updateLocationDto.parentId),
    });
    await this.repo.save(updatedInstance);
    return updatedInstance;
  }

  async remove(id: string) {
    await this.repo.delete(id);
    return { id };
  }

  private flattenLocationTree(tree: Location[]) {
    const result = [];
    const traverse = (tree: Location[], rootName?: string) => {
      for (const node of tree) {
        const { children, name, ...rest } = node;
        if (rootName) {
          result.push({ ...rest, rootName, name });
        }
        if (!children || !Array.isArray(children)) continue;
        traverse(children, rootName || name);
      }
    };
    traverse(tree, null);
    return result;
  }

  private async getParent(parentId?: string) {
    if (!parentId) return null;
    return this.repo.findOneBy({ id: parentId });
  }
}
