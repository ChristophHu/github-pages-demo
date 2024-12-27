import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GithubService } from './core/services/github.service';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    AsyncPipe,
    CommonModule,
    JsonPipe,
    RouterModule
  ],
  providers: [
    GithubService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {

  user$: Observable<any>
  
  constructor(private githubService: GithubService) {
    this.user$ = this.githubService.user$
  }
}
