import {Application} from "./application.model";
import {UserApplications} from "./user-applications";
import {Ds} from "./ds";

export class Account {
  constructor(
    public id: number,
    public enabled: boolean,
    public authorities: string[],
    public email: string,
    public firstName: string,
    public profile: 'OWNER' | 'SUPER_ADMIN' | 'OPERATOR',
    public centerId: number,
    public sellPointId: number,
    public langKey: string,
    public lastName: string,
    public username: string,
    public imageUrl: string,
    public mobile?: string,
    public mobilePrefix?: string,
    public sequence?: number,
    public licenseName?: string,
    public groupName?: string,
    public groupId?: number,
    public country?: string,
    public status?: string,
    public address?: string,
    public dateNewMeet?: string,
    public userApplications?: UserApplications[],
    public ds?: Ds
  ) {
  }
}

export interface SellPointResume {
  sellPointId: number;
  sellPointLabel: string;
}
