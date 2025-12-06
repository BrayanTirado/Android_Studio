import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactListPage } from '../contact-list/contact-list.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CommonModule, ContactListPage],
})
export class HomePage {}
