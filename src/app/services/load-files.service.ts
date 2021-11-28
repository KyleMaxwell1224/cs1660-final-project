import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { Injectable } from '@angular/core';
import { Buffer } from 'buffer';

@Injectable({
  providedIn: 'root'
})
export class LoadFilesService {
  API_URL = 'http://localhost:8000';
  
  constructor(private http: HttpClient) { }

  async uploadFiles(files: File[]): Promise<File[]> {
    console.log("FILES; " + files)
    let httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json'
          });
    const body = { files: files };
    return this.http.post(this.API_URL + '/processfiles', body, { headers: httpHeaders }).toPromise()
        .then(this.extractData)
        .catch(this.handleErrorPromise);
  }

  async requestTopN(n: number): Promise<any> {
    console.log("N count; " + n)
    let httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json'
          });
    const body = { n: n };

    return this.http.post(this.API_URL + '/topn',  body, { headers: httpHeaders }).toPromise()
        .then(this.extractArrayData)
        .catch(this.handleErrorPromise);
  }

  async search(word: String): Promise<any> {
    console.log("Search word; " + word)
    let httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json'
          });
    const body = { word: word };

    return this.http.post(this.API_URL + '/search',  body, { headers: httpHeaders }).toPromise()
        .then(this.extractArrayData)
        .catch(this.handleErrorPromise);
  }

  private handleErrorPromise(error: Response | any) {
    console.error(error.message || error);
    return Promise.reject(error.message || error);
  }

  private extractData(res: any) {
    let body = res;
    return body;
  }

  private extractArrayData(res: any) {
    console.log(res);
    var tempArray = [];
    let body = res;
    var array = body.split(/[\t\n]+/);
    for (let i = 0; i < array.length; i+=2) {
      console.log(array[i]);
      console.log(array[i+1]);
      if (array[i] == undefined || array[i+1] == undefined) {
        console.log("breaking")
        break;
      }

      var obj = {
        key: array[i+1],
        count: array[i]
      };
      tempArray.push(obj);
    }
  //  this.RESULTS = tempArray;
    console.log(tempArray);
    return tempArray;
  }
}
