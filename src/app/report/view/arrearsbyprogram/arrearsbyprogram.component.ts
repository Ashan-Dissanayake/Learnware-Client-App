import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ArrearsByProgram} from "../../entity/arrearsbyprogram";


declare var google: any;

@Component({
  selector: 'app-designation',
  templateUrl: './arrearsbyprogram.component.html',
  styleUrls: ['./arrearsbyprogram.component.css']
})
export class ArrearsbyprogramComponent implements OnInit {

  arrearsbyprograms!:ArrearsByProgram[];
  data!: MatTableDataSource<ArrearsByProgram>;
  p!  :number;

  columns: string[] = ['count', 'expected', 'paid','due','arrears','percentage'];
  headers: string[] = ['Count', 'Expected', 'Paid','Due','Arrears','Percentage'];
  binders: string[] = ['count', 'expected', 'paid','due','arrears','percentage'];

  @ViewChild('barchart', { static: false }) barchart: any;
  @ViewChild('piechart', { static: false }) piechart: any;

  constructor() {
    //Define Interactive Panel with Needed Form Elements
  }

  ngOnInit(): void {

   let bit:ArrearsByProgram = new ArrearsByProgram('BIT',10,450000,135000,315000,94500,30);
   let bitfulltime:ArrearsByProgram = new ArrearsByProgram('Full-Time',5,225000,67500,157500,47250,30);
   let bitproject:ArrearsByProgram = new ArrearsByProgram('Project',6,240000,72000,168000,50400,30);
   let fit:ArrearsByProgram = new ArrearsByProgram('FIT',8,160000,48000,112000,33600,30);

   this.p = bit.arrears;

   this.arrearsbyprograms  =[bit,bitfulltime,bitproject,fit]
    this.loadCharts();
    this.loadTable();
  }

  loadTable() : void{
    this.data = new MatTableDataSource(this.arrearsbyprograms);
  }

  loadCharts() : void{
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawCharts.bind(this));
  }


  drawCharts() {
    const barData = new google.visualization.DataTable();
    barData.addColumn('string', 'program');
    barData.addColumn('number', 'count');
    barData.addColumn('number', 'expected');
    barData.addColumn('number', 'paid');
    barData.addColumn('number', 'due');
    barData.addColumn('number', 'arrears');
    barData.addColumn('number', 'percentage');

    const pieData = new google.visualization.DataTable();
    pieData.addColumn('string', 'program');
    pieData.addColumn('number', 'count');
    pieData.addColumn('number', 'expected');
    pieData.addColumn('number', 'paid');
    pieData.addColumn('number', 'due');
    pieData.addColumn('number', 'arrears');
    pieData.addColumn('number', 'percentage');

    this.arrearsbyprograms.forEach((abp: ArrearsByProgram) => {
      barData.addRow([abp.program,abp.count, abp.expected,abp.paid,abp.due,abp.arrears,abp.percentage]);
      pieData.addRow([abp.program, abp.count, abp.expected, abp.paid, abp.due, abp.arrears, abp.percentage]);
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
      is3D: true
    };

    const barChart = new google.visualization.ColumnChart(this.barchart.nativeElement);
    barChart.draw(barData, barOptions);


    var pieChart = new google.visualization.PieChart(this.piechart.nativeElement);
    pieChart.draw(pieData, pieOptions);

  }

}
