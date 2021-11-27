import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadFilesService } from '../services/load-files.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  search = "";

  constructor(private loadFileService: LoadFilesService, private router: Router ) { }

  submitSearch() {
    console.log(this.search)
  }
  
  ngOnInit(): void {
  }

}
