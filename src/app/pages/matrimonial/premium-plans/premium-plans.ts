import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-premium-plan',
  templateUrl: './premium-plans.html',
  styleUrls: ['./premium-plans.scss'],
   imports:[FormsModule,CommonModule]
})
export class PremiumPlansComponent {

   plans = [
    {
      name: '1 Month',
      price: '₹499',
      description: `
       ✅  Perfect for trying out premium features.
        ✅ Unlimited profile views
        ✅ Send 20 messages per day
        ✅ Access to featured profiles
        ✅ Priority customer support
      `
    },
    {
      name: '1 Year',
      price: '₹4999',
      description: `
       ✅ Best value for long-term premium access.
        ✅ Unlimited profile views
        ✅ Send 100 messages per day
        ✅ Access to featured and verified profiles
        ✅ See who viewed your profile
        ✅ Priority customer support
        ✅ Profile highlighted for 1 year
      `
    },
    {
      name: 'Lifetime',
      price: '₹14999',
      description: `
        ✅Ultimate access with no expiration.
        ✅ Unlimited profile views and messages
        ✅ Access to featured & verified profiles forever
        ✅ See who viewed your profile
        ✅ Priority customer support forever
        ✅ Profile highlighted permanently
        ✅ Exclusive offers & discounts
      `
    }
  ];
 // Convert \n to <br> for HTML display
  getHtmlDescription(desc: string) {
    return desc.split('\n').join('<br>');
  }

  // subscribe(plan: any) {
  //   alert(`You selected the ${plan.name} plan!`);
  //   // You can replace this alert with your payment logic
  // }


  constructor(private router: Router) { }

  ngOnInit(): void {}

  goBack() {
    this.router.navigate(['/home']); // or Location.back()
  }

  goHome() {
    this.router.navigate(['/matrimonial-home']);
  }

  subscribe(plan: any) {
    alert(`You selected ${plan.name} for ₹${plan.price}`);
  }
}
