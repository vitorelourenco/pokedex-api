import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("pokemons")
export default class Pokemon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  number: string;

  @Column()
  image: string;

  @Column()
  weight: string;

  @Column()
  height: string;

  @Column()
  baseExp: number;

  @Column()
  description: string;
}

