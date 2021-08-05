import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import User from "./User";

@Entity("sessions")
export default class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sessions)
  user: User;
}
