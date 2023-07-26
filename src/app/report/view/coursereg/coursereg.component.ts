import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ArrearsByProgram} from "../../../../../../../Projects/Earth-University-College/Client-App/Sprint-2/5-Delete/src/app/service/entity/arrearsbyprogram";
import {Coursereg} from "../../../../../../../Projects/Earth-University-College/Client-App/Sprint-2/5-Delete/src/app/service/entity/coursereg";

declare var google: any;

@Component({
  selector: 'app-coursereg',
  templateUrl: './coursereg.component.html',
  styleUrls: ['./coursereg.component.css']
})
export class CourseregComponent implements OnInit{

  courseregs!:Coursereg[];
  data!: MatTableDataSource<Coursereg>;

  columns: string[] = ['no','coursename', 'prevyearreg', 'currentyearreg'];
  headers: string[] = ['No','Coursename', 'Prevyearreg', 'Currentyearreg'];
  binders: string[] = ['no','coursename', 'prevyearreg', 'currentyearreg'];

  // total!:number[];
  // ftext:string = "Total Counts"

  @ViewChild('columnchart', { static: false }) columnchart: any;
  @ViewChild('piechart', { static: false }) piechart: any;

  constructor() {

  }
  ngOnInit(): void {

    let course1:Coursereg = new Coursereg(1,"Python",100,120);
    let course2:Coursereg = new Coursereg(2,"Android",120,80);
    let course3:Coursereg = new Coursereg(3,"HTML",110,90);
    let course4:Coursereg = new Coursereg(4,"JAVA SCRIPT",90,130);

    this.courseregs = [course1,course2,course3,course4];

    // this.total = [1,2,3,4,5];

    this.loadTable();
    this.loadCharts();

  }

  loadTable() : void{
    this.data = new MatTableDataSource(this.courseregs);
  }

  loadCharts() : void{
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawCharts.bind(this));
  }


  drawCharts() {
    const barData = new google.visualization.DataTable();
    barData.addColumn('string', 'coursename');
    barData.addColumn('number', 'prevyearreg');
    barData.addColumn('number', 'currentyearreg');

    const pieData = new google.visualization.DataTable();
    pieData.addColumn('string', 'coursename');
    pieData.addColumn('number', 'prevyearreg');
    pieData.addColumn('number', 'currentyearreg');

    this.courseregs.forEach((course: Coursereg) => {
      barData.addRow([course.coursename,course.prevyearreg, course.currentyearreg]);
      pieData.addRow([course.coursename,course.prevyearreg, course.currentyearreg]);
    });

    const barOptions = {
      title: 'Designation Count (Bar Chart)',
      subtitle: 'Count of Employees by Designation',
      bars: 'vertical',
      height: 400,
      width: 600,
    };

    const pieOptions = {
      title: 'Designation Count (Pie Chart)',
      height: 400,
      width: 550,
    };

    const columnChart = new google.visualization.ColumnChart(this.columnchart.nativeElement);
    columnChart.draw(barData, barOptions);

    const pieChart = new google.visualization.PieChart(this.piechart.nativeElement);
    pieChart.draw(pieData, pieOptions);

  }



}
