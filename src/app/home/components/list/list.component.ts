import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { HomeService } from '../../home.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit {
  public items$ = this.homeService.items$;
  public searchValue: string;

  constructor(private homeService: HomeService) {
  }

  ngOnInit() {
    this.searchValue = this.homeService.getSearchValue();
  }

  public search(text: string): void {
    this.homeService.search(text);
  }
}
