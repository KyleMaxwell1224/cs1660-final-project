import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { LoadFilesService } from '../services/load-files.service';

@Component({
  selector: 'app-top-n',
  templateUrl: './top-n.component.html',
  styleUrls: ['./top-n.component.css']
})
export class TopNComponent implements OnInit {
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';

  value = 1;
  results: any[]  = [];
  loading: boolean = false;
  ready: boolean = true;
  columnsToDisplay = ['Word', 'Count'];

  constructor(private loadFileService: LoadFilesService, private router: Router ) { }

  async submitTopN() {
    console.log(this.value)
    this.loading = true;
    this.results = await this.loadFileService.requestTopN(this.value);
    this.loading = false;
    this.ready = true;
  }

  ngOnInit(): void {
  }

}
