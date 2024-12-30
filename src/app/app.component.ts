import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GithubService } from './core/services/github.service';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';
import { IconsComponent } from './shared/components/icons/icons.component';

@Component({
  selector: 'app-root',
  imports: [
    AsyncPipe,
    CommonModule,
    IconsComponent,
    JsonPipe,
    RouterModule
  ],
  providers: [
    GithubService
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass', './github.style.sass']
})
export class AppComponent {

  repos$: Observable<any>
  this_repo$: Observable<any>
  user$: Observable<any>

  show_settings: boolean = false
  name: string = ''
  version: string = '0.0.1'
  
  constructor(private githubService: GithubService) {
    this.repos$ = this.githubService.repos$
    this.this_repo$ = this.githubService.this_repo$
    this.user$ = this.githubService.user$

    this.name = this.githubService.getThisRepo()
    this.version = this.githubService.getVersion()
  }

  toggleSettings() {
    this.show_settings = !this.show_settings
  }
  toggleTheme() {
    this.toggleSettings()
  }
}
