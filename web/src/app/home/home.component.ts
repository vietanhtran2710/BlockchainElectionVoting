import { Component, OnInit } from '@angular/core';
import { BallotService} from '../ballot.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private ballotService: BallotService) { }

  ngOnInit(): void {
    
  }

}
