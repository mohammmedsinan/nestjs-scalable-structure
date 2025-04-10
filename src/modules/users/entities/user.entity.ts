import BaseEntity from 'src/common/entities/base.entity';
import { Entity, Column } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User extends BaseEntity {
  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ length: 100 })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  image: string;

  @Column()
  code: string;

  @Column()
  language: string;

  @Column()
  country_id: string;

  @Column()
  provider_id: string;

  @Column()
  provider_type: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: true })
  is_enabled: boolean;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({ nullable: true, default: false })
  is_email_verified: boolean;
}
