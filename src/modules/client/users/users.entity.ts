// curl -X POST http://localhost:3000/api/auth/signup -H 'Content-Type: application/json' -d '{"first_name":"Mohammed","last_name":"El-Sayed","username":"mohammed","email":"mohammed@gmail.com","password":"123456", "image":"/", "code":111, "language":1, "country": 1, "provider_id":1, "provider_type":1}'
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@common/entities';

@Entity({ name: 'users' })
export default class Users extends BaseEntity {
  @Column({ nullable: true })
  first_name?: string;

  @Column({ nullable: true })
  last_name?: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  image?: string;

  @Column()
  code: number;

  @Column({ nullable: true })
  language?: number;

  @Column({ nullable: true })
  country?: number;

  @Column({ nullable: true })
  refresh_token?: string;

  @Column({ nullable: true })
  provider_id?: number;

  @Column({ nullable: true })
  provider_type?: number;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ default: true })
  is_enabled: boolean;

  @Column({ default: false })
  is_deleted: boolean;
}
