import { Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// amCharts imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})

export class ChartComponent {
  private chart: am4charts.XYChart | undefined;

  // @ts-ignore
  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone) {}

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  // tslint:disable-next-line:typedef
  ngAfterViewInit() {
    // Chart code goes in here
    this.browserOnly(() => {
      am4core.useTheme(am4themes_animated);

      const chart = am4core.create('chartdiv', am4charts.XYChart);

      this.chart = chart;
      chart.paddingRight = 20;


      // @ts-ignore
      chart.data = [{
        country: 'Lithuania',
        litres: 501
      }, {
        country: 'Czechia',
        litres: 301
      }, {
        country: 'Ireland',
        litres: 201
      }, {
        country: 'Germany',
        litres: 165
      }, {
        country: 'Australia',
        litres: 139
      }, {
        country: 'Austria',
        litres: 128
      }, {
        country: 'UK',
        litres: 99
      }, {
        country: 'Belgium',
        litres: 60
      }, {
        country: 'The Netherlands',
        litres: 50
      }];

      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "country";
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

      let series = chart.series.push(new am4charts.ColumnSeries());
      series.name = "Sales";
      series.columns.template.tooltipText = "Series: {name}\nCategory: {categoryX}\nValue: {valueY}";
      series.columns.template.fill = am4core.color("#104547"); // fill
      series.dataFields.valueY = "litres";
      series.dataFields.categoryX = "country";

    });
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}
