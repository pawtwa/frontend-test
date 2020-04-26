import { Component, Input, OnInit } from '@angular/core';
import { IItem } from '../../interfaces/item.interface';
import { IListItem } from '../../interfaces/list-item.interface';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
})
export class ListItemComponent implements OnInit {
  @Input() public item: IListItem;

  constructor() {
  }

  ngOnInit(): void {
  }

  public getPaddingLeftByLevel(): string {
    return !!this.item?.level ? `${this.item.level * 15}px` : null;
  }
}
