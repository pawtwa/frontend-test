import { IItem } from './item.interface';

export interface IListItem extends IItem {
  level: number;
  children?: IListItem[];
}
