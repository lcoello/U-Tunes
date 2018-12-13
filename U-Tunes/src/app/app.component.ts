import { Component, OnInit } from '@angular/core';
import { ItunesService } from './service/itunes.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Items } from './model/ItunesItems';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  itunesForm: FormGroup;
  loading = false;
  notFound = false;
  items: Items[];

  constructor(private is: ItunesService, private fb: FormBuilder) {
    // initialize form
    this.createForm();
  }

  ngOnInit() {
    // listen on change for the select dropdown
    this.itunesForm.get('term').valueChanges
    .pipe(debounceTime(600)).subscribe(val => {
        if (val) {
          this.notFound = false;
          this.loading = true;
          // http request
          this.is.searchItunes(val).subscribe(data => {
            setTimeout(() => {
              this.loading = false;
              this.items = data;
              if (!this.items.length) {
                this.notFound = true;
              }
            }, 2000);
          });
        }
    });
  }

  // method to create form
  createForm() {
    this.itunesForm = this.fb.group({
      term: ['', Validators.required]
    });
  }

}
