import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {

  public static escapeRegExp(text: string): string {
    return text.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
  }

  constructor() {
  }
}
