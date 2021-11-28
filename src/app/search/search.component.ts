import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { LoadFilesService } from '../services/load-files.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  loading: boolean = false;
  ready: boolean = false;
  operation_time: number = 0;
  
  search = "";
  results: any[]  = [];

  constructor(private loadFileService: LoadFilesService, private router: Router ) { }

  async submitSearch() {
    var startDate = new Date();
    console.log(this.search)
    this.loading = true;
    this.ready = false;
    this.results = await this.loadFileService.search(this.search);
    var endDate   = new Date();
    var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
    this.operation_time = seconds;
    this.loading = false;
    this.ready = true;
    

  }
  
  ngOnInit(): void {
  }

}
