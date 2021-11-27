import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-engine-loaded',
  templateUrl: './engine-loaded.component.html',
  styleUrls: ['./engine-loaded.component.css']
})
export class EngineLoadedComponent implements OnInit {

  constructor(private router: Router ) { }

  routeTopN(): void {
    this.router.navigate(['/topn']);
  }
  
  routeToSearch(): void {
    this.router.navigate(['/search']);
  }

  ngOnInit(): void {
  }

}
