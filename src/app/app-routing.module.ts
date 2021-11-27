import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EngineLoadedComponent } from './engine-loaded/engine-loaded.component';
import { HomepageComponent } from './homepage/homepage.component';
import { SearchComponent } from './search/search.component';
import { TopNComponent } from './top-n/top-n.component';

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent
  },
  {
    path: 'loaded',
    component: EngineLoadedComponent
  },
  {
    path: 'topn',
    component: TopNComponent
  },
  {
    path: 'search',
    component: SearchComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
