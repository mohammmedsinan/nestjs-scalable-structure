// src/users/users.module.ts
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@common/entities';

@Entity({name:"users"})
export default class Users extends BaseEntity {
	@Column()
	username: string;

	@Column({unique: true})
	email: string;

	@Column()
	password: string;
}
