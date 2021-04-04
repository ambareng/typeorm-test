// Basically, these are models
import { IsEmail, IsEnum, Length } from "class-validator";
import {
  Entity,
  // PrimaryGeneratedColumn,
  Column,
  OneToMany,
  // BaseEntity,
  // CreateDateColumn,
  // UpdateDateColumn,
  // BeforeInsert,
} from "typeorm"; // Types

// import { v4 as uuid } from "uuid";

import Model from "./Model";

import { Post } from "./Post";

@Entity("users") // Shows that this is an entity
// User is entity name
export class User extends Model {
  // @PrimaryGeneratedColumn() // Stats that this is the primary key
  // id: number; // number is data type; id is name

  // @Column({ type: "uuid" })
  // uuid: string;

  @Column() // Just a normal field
  @Length(1, 255) // Length Validator
  name: string; // string data type

  @Column()
  @IsEmail() // Is Email Validator
  email: string;

  // This is just for database validations but is needed for Enum
  @Column({
    type: "enum",
    enum: ["user", "admin", "superadmin"], // Only valid
    default: "user", // Defualt value
  })
  @IsEnum(["user", "admin", "superadmin", undefined]) // You can do this to throw errors, undefined is added since we have default anyway
  role: string;

  @OneToMany(() => Post, (post) => post.user) // One to Many basically oppposite of ManyToOne
  posts: Post[]; // posts name and Post Entity Array Data type since remember a user can have more than one post

  // @CreateDateColumn() // Will automatically set to the date created
  // created_at: Date; // Date data type

  // @UpdateDateColumn() // Same logic as above
  // updated_at: Date;

  // @BeforeInsert()
  // createUUID() {
  //   this.uuid = uuid();
  // }

  // toJSON() {
  //   return { ...this, id: undefined };
  // }
}
