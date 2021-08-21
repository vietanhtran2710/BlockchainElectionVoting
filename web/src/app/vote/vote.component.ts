import { Component, OnInit } from '@angular/core';
import { BallotService } from '../ballot.service';
import { ActivatedRoute, Router } from '@angular/router';
import data from '../data.json';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {

  constructor(private ballotService: BallotService,
              private router: Router) { }

  currentAccount
  public _data:{ president: string, vicePresident: string, party: string,
                       presidentImage: string, vicePresidentImage: string
                     }[] = data;

  async ngOnInit(): Promise<void> {
    this.currentAccount = await this.ballotService.getAccount().then(function(result) {
      return result;
    });
    console.log("Current account: ",this.currentAccount);
  }

}
