import { Component, OnInit } from '@angular/core';
import { BallotService } from '../ballot.service';
import { ActivatedRoute, Router } from '@angular/router';
import data from '../data.json';
import Swal from 'sweetalert2';

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

  async vote(index) {
    Swal.fire({
      title: 'Confirm register',
      text: "Are you sure you want to vote for\n" + this._data[index].president + "/" + this._data[index].vicePresident + "?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const that = this;
        this.currentAccount = await this.ballotService.vote(index, this.currentAccount)
        .then(function(result) {
          Swal.fire(
            'Success!',
            'You voted successfully!',
            'success'
          )
          that.router.navigate([``])
        });
      }
    })
    
  }

}
