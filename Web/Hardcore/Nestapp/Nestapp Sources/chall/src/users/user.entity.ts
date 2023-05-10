import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ unique: true, length: 32 })
  public pseudo: string;

  @Column({ length: 6 })
  public password: string;
}
