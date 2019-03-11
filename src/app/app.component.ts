import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { allocHostVars } from '@angular/core/src/render3';
import { catchError, tap } from 'rxjs/operators';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  constructor(private http: HttpClient){
  }
  cars: any;
  errMsg:string = "";

  ngOnInit(){
    
    this.http.get('https://cors-anywhere.herokuapp.com/http://eacodingtest.digital.energyaustralia.com.au/api/v1/cars')
    .subscribe((carShows) => {
      if (carShows.toString().trim() !== "" && carShows.toString().trim() !== null){
        this.cars = this.allCars(carShows);
        this.errMsg = "";
      }else{
        this.errMsg = "No car show available at the moment!";
      }
    },
    err => {
      // console.error(err.status);
      this.errMsg = "Oops!...something wrong with the server!";
    });
  }

  /**
   * Converts json to array
   * @param carShows 
   */
  allCars(carShows: any){
    var carShowsArr = Array.of(carShows); // convert json to array
    var cars = this.arngCars(carShowsArr);
    return cars;
  }
  /**
   * Changes array structure to organise cars
   * @param carShowsArr 
   */
  arngCars(carShowsArr: any){
    var carsArr = [];
    var car:any;

    carShowsArr[0].forEach((shows: any, index: any) => {
      // console.log(shows);
      for (car of shows.cars) {
        var temp = { 'make': car.make, 'model': car.model, 'show': shows.name };
        carsArr.push(temp);
      }
    });
    carsArr.sort(this.sortCars("make"));
    return carsArr;
  }


  /**
     * Function to sort alphabetically the cars array by make
     * 
     * @param {String} make 
   */
  sortCars(make: string) {
    var sortOrder = 1;

    if (make[0] === "-") {
      sortOrder = -1;
      make = make.substr(1);
    }

    return function (a, b) {
      if (sortOrder == -1) {
        return b[make].localeCompare(a[make]);
      } else {
        return a[make].localeCompare(b[make]);
      }
    }
  }

  title = 'Energy Australa Car Show Test!';
}
