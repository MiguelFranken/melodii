import { Component, OnInit } from '@angular/core';
import { NavigationService } from "./navigation.service";
import { Observable } from "rxjs";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  public isClosed: Observable<boolean>;

  constructor(private navigationService: NavigationService) { }

  ngOnInit() {
    this.isClosed = this.navigationService.getIsClosedObservable();
  }

}
