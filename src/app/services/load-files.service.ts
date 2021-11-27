import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
        .then(this.extractData)
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
}
