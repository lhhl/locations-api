import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity()
@Tree('closure-table')
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  locationNumber: string;

  @Column({ type: 'float', nullable: true })
  area: number;

  @TreeParent()
  parent: Location;

  @Exclude()
  @Column({ nullable: true })
  parentId?: string;

  @TreeChildren()
  children: Location[];
}
