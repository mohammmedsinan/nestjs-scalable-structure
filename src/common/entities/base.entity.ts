import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'bigint',
    nullable: false,
  })
  createdAt: number;

  @Column({
    type: 'bigint',
    nullable: false,
  })
  updatedAt: number;

  @BeforeInsert()
  setCreatedAndUpdatedAt() {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    this.createdAt = currentTimestamp;
    this.updatedAt = currentTimestamp;
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = Math.floor(Date.now() / 1000);
  }
}
