import { Component, OnInit } from '@angular/core';
import { IUserProfile, IEvent, IInterest } from '../../interfaces';
import { ActivatedRoute, Params } from '@angular/router';
import { DataService } from '../../data.service';
import { API } from '../../../api';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  public profile: IUserProfile;
  public events: IEvent[];
  public error: number;
  public interest: IInterest;
  public interests: IInterest[];

  constructor(
    public activatedRoute: ActivatedRoute,
    public dataService: DataService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      const userId = params['id'];
      this.dataService.FireGET<IUserProfile>(API.User, { uuid: userId }).subscribe(result => {
        /* Initialize */
        this.events = result.events_going.concat(result.events_interested);
        this.interests = result.interest;
        result.former_roles.forEach(r => r.name = `Former ${r.name} ${r.year}`);
        result.roles = result.roles.concat(result.former_roles);
        this.dataService.setTitle(result.name);

        /* Set fallback image */
        if (!result.profile_pic || result.profile_pic === '') {
          result.profile_pic = 'assets/useravatar.svg';
        }

        /* Show the user */
        this.profile = result;
      }, (e) => {
        this.error = e.status;
      });
    });
  }

  hasField(field: string) {
    return this.profile[field] && this.profile[field].toUpperCase() !== 'N/A';
  }


  setInterest(event: any): void {
    if (event.option) {
      console.log(event.option.value.title)
      this.interest.title = event.option.value.title;


      // fire a request to add this interest as a interest of the loged in user
    }
  }

}
