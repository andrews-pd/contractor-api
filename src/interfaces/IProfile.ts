export enum ProfileType {
  Client = "client",
  Contractor = "contractor"
}

export interface IProfile {
  id: number;
  type: ProfileType;
}
