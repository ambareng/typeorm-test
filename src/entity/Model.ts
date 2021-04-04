import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";

import { v4 as uuid } from "uuid";

export default abstract class Model extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid" })
  uuid: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  createUUID() {
    this.uuid = uuid();
  }

  toJSON() {
    return { ...this, id: undefined };
  }

  // This is the constructor I was talking about for now this is a generic constructor and will take in ANYTHING use with caution
  constructor(model?: Partial<any>) {
    super();
    Object.assign(this, model);
  }
}
