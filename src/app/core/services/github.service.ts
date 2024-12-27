import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, take, tap } from 'rxjs';

interface DataState {
  data: any
  loaded: boolean
}
@Injectable({
  providedIn: 'root'
})
export class GithubService {
  apiURL = "https://api.github.com"
  username: string = 'christophhu'
  TOKEN = 'github_pat_...'
  TOKEN_ORG = 'github_pat_...'

  events$: Observable<any> = of()
  topEvents$: Observable<any> = of()

  private readonly initialState: DataState = { data: null, loaded: false }

  private readonly _repos = new BehaviorSubject<DataState>(this.initialState)
  repos$: Observable<any> = this._repos.asObservable()

  private readonly _user = new BehaviorSubject<DataState>(this.initialState)
  user$: Observable<any> = this._user.asObservable()
  
  header = {
    headers: {
      // Accept: "application/vnd.github.v3.raw+json", "Content-Type": "application/json;charset=UTF-8",
      // Authorization: `token ${this.TOKEN}`,
    },
  }
  header_org = {
    headers: {
      // Accept: "application/vnd.github.v3.raw+json", "Content-Type": "application/json;charset=UTF-8",
      // Authorization: `token ${this.TOKEN_ORG}`,
    },
  }

  constructor(private http: HttpClient) {
    // this.getSingleUser(this.username).pipe(
    //   take(1),
    //   tap(data => console.log('user', JSON.parse(JSON.stringify(data)))),
    //   map((data: any) => { this._user.next({ data, loaded: true }); return of(data) })
    // ).subscribe()
    let userdata = JSON.parse(JSON.stringify({"login":"ChristophHu","id":25291819,"node_id":"MDQ6VXNlcjI1MjkxODE5","avatar_url":"https://avatars.githubusercontent.com/u/25291819?v=4","gravatar_id":"","url":"https://api.github.com/users/ChristophHu","html_url":"https://github.com/ChristophHu","followers_url":"https://api.github.com/users/ChristophHu/followers","following_url":"https://api.github.com/users/ChristophHu/following{/other_user}","gists_url":"https://api.github.com/users/ChristophHu/gists{/gist_id}","starred_url":"https://api.github.com/users/ChristophHu/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/ChristophHu/subscriptions","organizations_url":"https://api.github.com/users/ChristophHu/orgs","repos_url":"https://api.github.com/users/ChristophHu/repos","events_url":"https://api.github.com/users/ChristophHu/events{/privacy}","received_events_url":"https://api.github.com/users/ChristophHu/received_events","type":"User","user_view_type":"public","site_admin":false,"name":"Christoph","company":"@nxt-codes","blog":"https://nxt.codes","location":"Berlin, DE","email":null,"hireable":null,"bio":null,"twitter_username":null,"public_repos":67,"public_gists":5,"followers":132,"following":284,"created_at":"2017-01-23T05:32:39Z","updated_at":"2024-12-23T07:08:41Z"}))
    this._user.next({ data: userdata, loaded: true })
  }

  

  getSingleUser(username: string) {
    return this.http.get(`${this.apiURL}/users/${username}`, this.header)
  }
  getRepo(name: string, header = this.header) {
    return this.http.get(`${this.apiURL}/repos/${name}`, this.header).pipe(take(1))
  }
  getRepos(username: string) {
    return this.http.get(`${this.apiURL}/users/${username}/repos`, this.header).pipe(take(1))
  }
  getEvents(username: string) {
    return this.http.get(`${this.apiURL}/users/${username}/events`, this.header).pipe(take(1))
  }
  getRecentUpdates(top: number) {
    this.events$
    .pipe(take(1))
    .subscribe(data => {
      let repos: any[] = []
      console.log('event data', data)
      if (data) {
        data.forEach((repo: any) => {
          if (repo.type == 'PushEvent') repos.push(repo.repo.name)
        })
      }
      Array.from(new Set(repos)).slice(0, top).forEach(repo => {
        this.getRepo(repo).pipe(take(1)).subscribe({
          next: data => {
            console.log('repo', data)
          },
          error: error => {
            this.getRepo(repo, this.header_org).pipe(take(1)).subscribe({
              next: data => {
                console.log('repo', data)
              },
              error: error => {
                console.error('error', error)
              }
            })
          }
        })
      })
      console.log('repos', Array.from(new Set(repos)).slice(0, top))
      this.topEvents$ = of(Array.from(new Set(repos)).slice(0, top))
    })
  }
}
