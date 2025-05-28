import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DeliveryBottomNavComponent } from './delivery-bottom-nav/delivery-bottom-nav.component';

@Component({
  selector: 'app-delivery-layout',
  standalone: true,
  imports: [RouterOutlet, DeliveryBottomNavComponent],
  templateUrl: './delivery-layout.component.html',
  styleUrl: './delivery-layout.component.css'
})
export class DeliveryLayoutComponent {

}
