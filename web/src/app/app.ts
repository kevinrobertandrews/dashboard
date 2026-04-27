import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('web');
  protected readonly lastUpdated = signal('--');

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<{ time: string }>('http://localhost:3000/last-updated').subscribe((data) => {
      console.log(data)
      this.lastUpdated.set(data.time);
    });
  }
}
