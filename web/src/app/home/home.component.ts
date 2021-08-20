import { Component, OnInit } from '@angular/core';
import { BallotService} from '../ballot.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private ballotService: BallotService) { 

  }
  
  currentAccount
  chairmanAddress
  isChairman = false;

  async ngOnInit(): Promise<void> {
    this.currentAccount = await this.ballotService.getAccount().then(function(result) {
      return result;
    });
    console.log("Current account: ",this.currentAccount);
    this.chairmanAddress = await this.ballotService.getChairman(this.currentAccount).then(function(result) {
      return result;
    });
    console.log("Chair person address", this.chairmanAddress);
    if (this.chairmanAddress == this.currentAccount) this.isChairman = true;
    console.log("Result: ", this.isChairman)
  }

}
