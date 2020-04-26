import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IItem } from './interfaces/item.interface';
import { debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { IListItem } from './interfaces/list-item.interface';
import { AppService } from '../app.service';

@Injectable({
  providedIn: 'root',
})
export class HomeService implements OnDestroy {
  public items$: Observable<IListItem[]>;

  private apiBaseUrl = environment.apiBaseUrl;
  private basePath = 'items';

  private onDestroy$ = new Subject<void>();
  private search$ = new BehaviorSubject<string>(null);

  constructor(private http: HttpClient) {
    /**
     * method applied: API call on searching - with `query string`
     *
     * alternative method: fetch and store all items - filtering local storage data
     */
    this.items$ = this.search$.pipe(
      this.prepareSearching,
      switchMap(this.searchItems),
      map(this.setLevel),
      map(this.createHierarchicalTree),
      map(this.createHierarchicalFlatTree),
    );
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public getSearchValue(): string {
    return this.search$.getValue();
  }

  public search(titleLike: string): void {
    this.search$.next(titleLike);
  }

  private findItemBy<T>(items: IItem[], by: string, value: T): IItem {
    return !!(value as T) && items?.find ? items.find((item: IItem) => item[by] === (value as T)) : undefined;
  }

  private findListItemsBy<T>(items: IListItem[], by: string, value: T): IListItem[] {
    return !!(value as T) && items?.filter ? items.filter((item: IListItem) => item[by] === (value as T)) : [];
  }

  private getItemLevel(item: IItem, items: IItem[]): number {
    let level = 0;
    let found = this.findItemBy<number>(items, 'id', item.parent_id);
    while (!!found) {
      level++;
      found = this.findItemBy<number>(items, 'id', found.parent_id);
    }
    return level;
  }

  private prepareSearching = (source: Observable<string>): Observable<string> => {
    return source.pipe(
      debounceTime(200),
      map((titleLike?: string) => titleLike ? titleLike.trim() : titleLike),
      filter((titleLike?: string) => !titleLike || +titleLike.length >= 3),
      distinctUntilChanged(),
    );
  };

  private searchItems = (titleLike?: string): Observable<IItem[]> => {
    const url = `${this.apiBaseUrl}/${this.basePath}${
      titleLike && titleLike.length ? `?title_like=${AppService.escapeRegExp(titleLike)}` : ''
    }`;
    return this.http.get<IItem[]>(url);
  };

  /**
   * @param items - source items
   */
  private setLevel = (items: IItem[]): IListItem[] => {
    return !!items?.map ? items.map((item: IItem): IListItem => ({
      ...item,
      level: this.getItemLevel(item, items),
    })) : [];
  };

  /**
   * @param tree - hierarchical tree
   */
  private createHierarchicalFlatTree = (tree: IListItem[]): IListItem[] => {
    if (!!tree?.length) {
      const flatTree: IListItem[] = [];
      tree.forEach((item: IListItem) => {
        flatTree.push(item);
        flatTree.push(...this.getAllDescendantsAsFlatTree(item));
      });
      return flatTree;
    }
    return tree;
  };

  /**
   * @param items - source items
   */
  private createHierarchicalTree = (items: IListItem[]): IListItem[] => {
    if (!!items?.length) {
      const tree: any[] = [];
      items.forEach((item: IListItem) => {
        const children = this.findListItemsBy<number>(items, 'parent_id', item.id);
        console.log(item, children);
        if (children.length) {
          if (!item.children?.length) {
            item.children = [];
          }
          item.children.push(...children);
        }
        if (!item.parent_id) {
          tree.push(item);
        } else {
          const parents = this.findListItemsBy<number>(items, 'id', item.parent_id);
          if (!parents?.length) {
            tree.push(item);
          }
        }
      });
      return tree;
    }
    return items;
  };

  /**
   * @param treeItem - hierarchical tree item
   */
  private getAllDescendantsAsFlatTree(treeItem: IListItem): IListItem[] {
    const descendantsFlatTree: IListItem[] = [];
    if (!!treeItem.children?.length) {
      descendantsFlatTree.push(...treeItem.children);
      treeItem.children.forEach((childItem: IListItem) => {
        const childDescendantsFlatTree: IListItem[] = this.getAllDescendantsAsFlatTree(childItem);
        if (childDescendantsFlatTree.length) {
          descendantsFlatTree.push(...childDescendantsFlatTree);
        }
      });
    }
    return descendantsFlatTree;
  }
}
