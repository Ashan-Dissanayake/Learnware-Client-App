import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";

declare var google: any;

interface AssignmentSubmission{
  course: string;
  date: string;
  percentage: string;
}

interface UpcomingClasses{
  name: string;
  date: string;
  duration: string;
}

interface PieChartConfig {
  data: any[];
  options: any;
  chartElement: any;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  assignmentData! : AssignmentSubmission[];
  upcomingclasses! : UpcomingClasses[];
  data1!: MatTableDataSource<AssignmentSubmission>;
  data2!: MatTableDataSource<UpcomingClasses>;

  columns1: string[] = ['course', 'date', 'percentage'];
  headers1: string[] = ['Course', 'Date', 'Percentage'];
  binders1: string[] = ['course', 'date', 'percentage'];

  columns2: string[] = ['name', 'date', 'duration'];
  headers2: string[] = ['Class', 'Date', 'Duration'];
  binders2: string[] = ['name', 'date', 'duration'];

  @ViewChildren('LastSessionPie') LastSessionPie!: QueryList<any>;
  @ViewChildren('OverrallSessionPie') OverrallSessionPie!: QueryList<any>;

  pieChartConfigs: PieChartConfig[] = [
    {
      data: [
        ['Effort', 'Amount given'],
        ['Reviews', 80],
        ['No Comments', 20],
      ],
      options: {
        heading: 'Understandability',
        titleTextStyle: {
          fontSize: 13, // Adjust the font size to your desired value
          bold: true,
        },
        height: 250,
        width: 180,
        pieHole: 0.5,
        pieSliceTextStyle: {
          color: 'black',
        },
        legend: 'none',
      },
      chartElement: null,
    },

    {
      data: [
        ['Effort', 'Amount given'],
        ['Reviews', 82],
        ['No Comments', 18],
      ],
      options: {
        heading: 'Enjoyability',
        titleTextStyle: {
          fontSize: 13, // Adjust the font size to your desired value
          bold: true, // Optionally make the title bold
        },
        height: 250,
        width: 180,
        pieHole: 0.5,
        pieSliceTextStyle: {
          color: 'black',
        },
        legend: 'none',
      },
      chartElement: null,
    },
    {
      data: [
        ['Effort', 'Amount given'],
        ['Reviews', 70],
        ['No Comments', 30],
      ],
      options: {
        heading: 'Punctuality',
        titleTextStyle: {
          fontSize: 13,
          bold: true,
        },
        height: 250,
        width: 180,
        pieHole: 0.5,
        pieSliceTextStyle: {
          color: 'black',
        },
        legend: 'none',
      },
      chartElement: null,
    },
  ];

  ngOnInit(): void {
    this.loadCharts();
    this.drawTable();
    this.loadData();
  }

  loadCharts(): void {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(() => this.drawCharts());
  }

  drawPieChart(data: any[], options: any, chartElement: any): void {
    const pieData = google.visualization.arrayToDataTable(data);

    const pieChart = new google.visualization.PieChart(chartElement.nativeElement);
    pieChart.draw(pieData, options);
  }

  drawCharts(): void {

    this.LastSessionPie.forEach((chartElement, index) => {
      const config = this.pieChartConfigs[index];
      config.chartElement = chartElement;
      this.drawPieChart(config.data, config.options, config.chartElement);
    });
    this.OverrallSessionPie.forEach((chartElement, index) => {
      const config = this.pieChartConfigs[index];
      config.chartElement = chartElement;
      this.drawPieChart(config.data, config.options, config.chartElement);
    });
  }

  loadData(): void {
    this.data1 = new MatTableDataSource<AssignmentSubmission>(this.assignmentData);
    this.data2 = new MatTableDataSource<UpcomingClasses>(this.upcomingclasses);
  }

  drawTable(): void {
    this.assignmentData = [
      { course: 'Course A', date: '2023-01-01', percentage: '80%' },
      { course: 'Course B', date: '2023-02-01', percentage: '90%' },
      { course: 'Course C', date: '2023-03-01', percentage: '75%' },
    ];

    this.upcomingclasses = [
      { name: 'Course A', date: '2023-01-01', duration: '8.00am - 9.45am' },
      { name: 'Course B', date: '2023-02-01', duration: '10.15am - 12.00pm' },
      { name: 'Course C', date: '2023-03-01', duration: '1.00pm - 2.45pm' },
    ];
  }
}
