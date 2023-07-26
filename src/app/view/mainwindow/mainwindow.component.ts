import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {AuthorizationManager} from "../../service/authorizationmanager";


@Component({
  selector: 'app-mainwindow',
  templateUrl: './mainwindow.component.html',
  styleUrls: ['./mainwindow.component.css']
})
export class MainwindowComponent {

  sidenavOpen = false;
  sidenaveMode = 'side';

  constructor(private router: Router, private breakpointObserver: BreakpointObserver,public authService: AuthorizationManager) {
    breakpointObserver.observe([
      Breakpoints.HandsetPortrait,
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
    ]).subscribe(reslut => {
      for (const query of Object.keys(reslut.breakpoints)) {
        if (reslut.breakpoints[query]) {
          this.sidenavOpen = true;
          this.sidenaveMode = 'side';
        }else{
          this.sidenavOpen = false;
          this.sidenaveMode = 'side';
        }
      }
    });
  }

  ngOnInit(): void {
    this.sidenavOpen = true;
  }


  close(): void{
    const width = window.innerWidth;
    if (width < 992){
      this.sidenavOpen = !this.sidenavOpen;
    }
  }

  opened: boolean=true;

  logout(): void {
    this.router.navigateByUrl("login");
    this.authService.clearUsername();
    this.authService.clearButtonState();
    this.authService.clearMenuState();
    localStorage.removeItem("Authorization");
  }

  menuItems = this.authService.menuItems;

}
