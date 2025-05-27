import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddressService } from '../../services/address.service';
import { AddressDTO } from '../../models/address-dto';
import { Router } from '@angular/router';
import { Response, ResponseStatus } from '../../models/response';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AddressListComponent implements OnInit {
  addresses: AddressDTO[] = [];
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;
  isAddingNew = false;
  newAddress: AddressDTO = this.getEmptyAddress();

  constructor(
    private addressService: AddressService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAddresses();
  }

  private loadAddresses(): void {
    this.loading = true;
    this.error = null;

    this.addressService.getAllAddresses()
      .subscribe({
        next: (response) => {
          if (response.status === ResponseStatus.Success) {
            this.addresses = response.data;
          } else {
            this.error = response.message;
          }
        },
        error: (error) => {
          this.error = 'Failed to load addresses. Please try again later.';
          console.error('Error loading addresses:', error);
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  startAddNew(): void {
    this.isAddingNew = true;
    this.error = null;
    this.successMessage = null;
    this.newAddress = this.getEmptyAddress();
  }

  cancelAdd(): void {
    this.isAddingNew = false;
    this.error = null;
    this.successMessage = null;
  }

  onSubmit(): void {
    this.loading = true;
    this.error = null;
    this.successMessage = null;

    this.addressService.addAddress(this.newAddress)
      .subscribe({
        next: (response) => {
          if (response.status === ResponseStatus.Success) {
            this.successMessage = 'Address added successfully';
            this.loadAddresses();
            this.isAddingNew = false;
            this.newAddress = this.getEmptyAddress();
          } else {
            this.error = response.message;
          }
        },
        error: (error) => {
          this.error = 'Failed to add address. Please try again later.';
          console.error('Error adding address:', error);
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  onEdit(address: AddressDTO): void {
    // Store the address ID in the router state and navigate to edit page
    this.router.navigate(['/addresses/edit', address.id], { state: { address } });
  }

  onDelete(id: number): void {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.successMessage = null;

    this.addressService.deleteAddress(id)
      .subscribe({
        next: (response) => {
          if (response.status === ResponseStatus.Success) {
            this.successMessage = 'Address deleted successfully';
            this.loadAddresses();
          } else {
            this.error = response.message;
          }
        },
        error: (error) => {
          this.error = 'Failed to delete address. Please try again later.';
          console.error('Error deleting address:', error);
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  setAsDefault(id: number): void {
    this.loading = true;
    this.error = null;
    this.successMessage = null;

    this.addressService.setDefaultAddress(id)
      .subscribe({
        next: (response) => {
          if (response.status === ResponseStatus.Success) {
            this.successMessage = 'Default address updated successfully';
            this.loadAddresses();
          } else {
            this.error = response.message;
          }
        },
        error: (error) => {
          this.error = 'Failed to update default address. Please try again later.';
          console.error('Error updating default address:', error);
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  private getEmptyAddress(): AddressDTO {
    return {
      id: 0,
      street: '',
      city: '',
      state: '',
      postalCode: '',
      customerId: 0,
      isDefault: false
    };
  }
}
