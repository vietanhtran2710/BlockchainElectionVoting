import { Component, OnInit } from '@angular/core';
import { BallotService } from '../ballot.service';
import { ActivatedRoute, Router } from '@angular/router'
import Swal from 'sweetalert2';

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
  formData = {
    address: ''
  }

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

  register() {
    Swal.fire({
      title: 'Confirm register',
      text: "Are you sure you want to register\n" + this.formData.address + "?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ballotService.register(this.formData.address, this.currentAccount)
        .then(function(result) {
          if ((result as any).status) {
            Swal.fire(
              'Success!',
              'Account registered',
              'success'
            )
          }
        })
        
      }
    })
    
  }

}
