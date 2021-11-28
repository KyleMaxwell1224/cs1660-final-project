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
  ready: boolean = false;
  operation_time: number = 0;

  constructor(private loadFileService: LoadFilesService, private router: Router ) { }

  async submitTopN() {
    var startDate   = new Date();
    console.log(this.value)
    this.loading = true;
    this.ready = false;
    this.results = await this.loadFileService.requestTopN(this.value);
    var endDate   = new Date();
    var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
    this.operation_time = seconds;
    this.loading = false;
    this.ready = true;
  }

  ngOnInit(): void {
  }

}
