import { Entity, Column, ManyToOne } from "typeorm";

import Model from "./Model";
import { User } from "./User"; // Don't forget to import the related Entity

@Entity("posts")
export class Post extends Model {
  @Column()
  title: string;

  @Column()
  body: string;

  // This has a ManyToOne Relationship with user meaning a User can have many posts, but a post can only have one user
  @ManyToOne(() => User) // You can omit the reversal(?) if ManyToOne
  user: User; // user name with User Entity data type
}
