import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItem, SelectedCustomization, MenuItemCustomization, CustomizationType } from '../../../core/models/menu.model';
import { SimpleI18nService } from '../../../core/services/simple-i18n.service';

export interface CustomizationModalResult {
  quantity: number;
  customizations: SelectedCustomization[];
  specialInstructions?: string;
  totalPrice: number;
}

@Component({
  selector: 'app-item-customization-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './item-customization-modal.component.html',
  styleUrl: './item-customization-modal.component.css'
})
export class ItemCustomizationModalComponent implements OnInit {
  @Input() menuItem!: MenuItem;
  @Input() isVisible = false;
  @Output() onConfirm = new EventEmitter<CustomizationModalResult>();
  @Output() onCancel = new EventEmitter<void>();

  quantity = 1;
  selectedCustomizations: SelectedCustomization[] = [];
  specialInstructions = '';
  totalPrice = 0;

  // Expose enum to template
  CustomizationType = CustomizationType;

  constructor(private i18nService: SimpleI18nService) {}

  ngOnInit(): void {
    this.initializeCustomizations();
    this.calculateTotalPrice();
  }

  private initializeCustomizations(): void {
    this.selectedCustomizations = this.menuItem.customizations.map(customization => ({
      customizationId: customization.id,
      optionIds: customization.options
        .filter(option => option.isDefault)
        .map(option => option.id),
      textValue: customization.type === CustomizationType.TEXT_INPUT ? '' : undefined
    }));
  }

  onQuantityChange(): void {
    if (this.quantity < 1) this.quantity = 1;
    if (this.quantity > 10) this.quantity = 10;
    this.calculateTotalPrice();
  }

  onSingleSelectChange(customizationId: string, optionId: string): void {
    const customization = this.selectedCustomizations.find(c => c.customizationId === customizationId);
    if (customization) {
      customization.optionIds = [optionId];
    }
    this.calculateTotalPrice();
  }

  onMultiSelectChange(customizationId: string, optionId: string, checked: boolean): void {
    const customization = this.selectedCustomizations.find(c => c.customizationId === customizationId);
    if (customization) {
      if (checked) {
        if (!customization.optionIds.includes(optionId)) {
          customization.optionIds.push(optionId);
        }
      } else {
        customization.optionIds = customization.optionIds.filter(id => id !== optionId);
      }
    }
    this.calculateTotalPrice();
  }

  onTextInputChange(customizationId: string, value: string): void {
    const customization = this.selectedCustomizations.find(c => c.customizationId === customizationId);
    if (customization) {
      customization.textValue = value;
    }
  }

  private calculateTotalPrice(): void {
    let basePrice = this.menuItem.price;

    // Add customization prices
    this.selectedCustomizations.forEach(selectedCustomization => {
      const menuCustomization = this.menuItem.customizations.find(c => c.id === selectedCustomization.customizationId);
      if (menuCustomization) {
        selectedCustomization.optionIds.forEach(optionId => {
          const option = menuCustomization.options.find(o => o.id === optionId);
          if (option) {
            basePrice += option.price;
          }
        });
      }
    });

    this.totalPrice = basePrice * this.quantity;
  }

  isOptionSelected(customizationId: string, optionId: string): boolean {
    const customization = this.selectedCustomizations.find(c => c.customizationId === customizationId);
    return customization ? customization.optionIds.includes(optionId) : false;
  }

  getSelectedOptionId(customizationId: string): string {
    const customization = this.selectedCustomizations.find(c => c.customizationId === customizationId);
    return customization && customization.optionIds.length > 0 ? customization.optionIds[0] : '';
  }

  getTextValue(customizationId: string): string {
    const customization = this.selectedCustomizations.find(c => c.customizationId === customizationId);
    return customization?.textValue || '';
  }

  isFormValid(): boolean {
    // Check if all required customizations are selected
    return this.menuItem.customizations.every(customization => {
      if (!customization.isRequired) return true;

      const selected = this.selectedCustomizations.find(c => c.customizationId === customization.id);
      if (!selected) return false;

      if (customization.type === CustomizationType.TEXT_INPUT) {
        return selected.textValue && selected.textValue.trim().length > 0;
      } else {
        return selected.optionIds.length > 0;
      }
    });
  }

  onConfirmClick(): void {
    if (!this.isFormValid()) return;

    const result: CustomizationModalResult = {
      quantity: this.quantity,
      customizations: this.selectedCustomizations,
      specialInstructions: this.specialInstructions.trim() || undefined,
      totalPrice: this.totalPrice
    };

    this.onConfirm.emit(result);
  }

  onCancelClick(): void {
    this.onCancel.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCancelClick();
    }
  }

  translate(key: string): string {
    return this.i18nService.translate(key);
  }

  isRTL(): boolean {
    return this.i18nService.isRTL();
  }

  formatPrice(price: number): string {
    return price.toFixed(2);
  }

  getCustomizationById(customizationId: string): MenuItemCustomization | undefined {
    return this.menuItem.customizations.find(c => c.id === customizationId);
  }

  getOptionPrice(customization: MenuItemCustomization, optionId: string): number {
    const option = customization.options.find(o => o.id === optionId);
    return option ? option.price : 0;
  }

  getDietaryIcons(): string[] {
    const icons: string[] = [];
    if (this.menuItem.isVegetarian) icons.push('🥬');
    if (this.menuItem.isVegan) icons.push('🌱');
    if (this.menuItem.isGlutenFree) icons.push('🌾');
    if (this.menuItem.isSpicy) icons.push('🌶️');
    return icons;
  }
}
