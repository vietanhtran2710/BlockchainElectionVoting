import { Component, OnInit } from '@angular/core';
import { BallotService } from '../ballot.service';
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private ballotService: BallotService,
              private router: Router) { }

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
    if (this.chairmanAddress != this.currentAccount) {
      this.router.navigate([``])
    }
    else this.isChairman = true;
  }

}
