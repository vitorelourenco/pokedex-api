import { getRepository } from "typeorm";

export async function getSalt(entitiy: any) {
  const response: any[] = await getRepository(entitiy).find({
    select: ["id"],
    order: { id: "DESC" },
    take: 1,
  });

  let salt = 10001
  const id = response[0]?.id;
  if (id) {
    salt += id;
  }
  const saltStr:string = `${salt}`;
  return saltStr;
}

export class Instance{
  entity: any;
  reqData: any;
  ormData: any;
  ormRepository: any;
  ormInstance: any;
  saveToDatabase: Function;
  constructor(entity:any, ormData:any, reqData:any){
    this.entity = entity;
    this.reqData = reqData;
    this.ormData = ormData;
    this.ormRepository = getRepository(entity);
    this.ormInstance = getRepository(entity).create(ormData);
    this.saveToDatabase = async() => getRepository(entity).save(this.ormInstance);
  }
}
