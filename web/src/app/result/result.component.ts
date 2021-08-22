import { Component, OnInit } from '@angular/core';
import { ChartsModule, WavesModule } from 'angular-bootstrap-md'
import data from '../data.json';
import { BallotService} from '../ballot.service'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  currentAccount
  chairmanAddress
  isChairman = false;
  voteResult
  resultLoaded = false;

  public chartType: string = 'horizontalBar';

  public chartDatasets: Array<any> = [
    { data: [], label: 'Vote Count' }
  ];

  public chartLabels: Array<any> = [];

  public chartColors: Array<any> = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 2,
    }
  ];

  public chartOptions: any = {
    responsive: true
  };
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }

  constructor(private ballotService: BallotService,
              private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.currentAccount = await this.ballotService.getAccount().then(function(result) {
      return result;
    });
    console.log("Current account: ",this.currentAccount);
    this.chairmanAddress = await this.ballotService.getChairman(this.currentAccount).then(function(result) {
      return result;
    });
    console.log("Chair person address", this.chairmanAddress);
    if (this.chairmanAddress != this.currentAccount) {
      this.router.navigate([``])
    }
    else {
      for (let item of data) {
        this.chartLabels.push(item.president + "/" + item.vicePresident);
      }
      this.voteResult = this.chairmanAddress = await this.ballotService.getVoteResult(this.currentAccount).then(function(result) {
        return result;
      });
      this.voteResult = this.voteResult.map(x=>+x);
      console.log(this.voteResult);
      this.chartDatasets[0].data = this.voteResult;
      this.resultLoaded = true;
    }
    
  }

  

}
