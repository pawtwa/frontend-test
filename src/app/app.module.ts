import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListItemComponent } from './home/components/list-item/list-item.component';
import { ListComponent } from './home/components/list/list.component';
import { SingleComponent } from './home/components/single/single.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, ListItemComponent, ListComponent, SingleComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, FormsModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
