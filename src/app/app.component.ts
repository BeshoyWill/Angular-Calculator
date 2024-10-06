import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'calculator';

  firstValue: string = '';
  secondValue: string = '';
  currentValue: string = ''; // The value currently being typed
  symbol: string = ''; // The operator symbol
  result: string | number = 0;
  finalResult!: number;
  isSecondValue: boolean = false;

  // Handle button clicks for numbers, operators, and parentheses
  getAction(item: string | number) {
    if (typeof item === 'number' || item === '.') {
      // If the item is a number or decimal point, append it to the current value
      if (!(item === 0 && this.currentValue === '')) {
        // Prevent leading zeros
        this.currentValue += item.toString();

        // If we are typing the second value, append it to secondValue
        if (this.isSecondValue) {
          this.secondValue += item.toString();
        } else {
          this.firstValue += item.toString();
        }

        this.result = this.currentValue;
      }
    } else if (
      item === '+' ||
      item === '-' ||
      item === 'x' ||
      item === '÷' ||
      item === '%'
    ) {
      // Convert the operator to the proper symbol for JavaScript
      const symbol = item === 'x' ? '*' : item === '÷' ? '/' : item;

      // If we are already typing the second value and a new symbol is clicked,
      // first calculate the result for the current operation
      if (this.firstValue && this.secondValue) {
        this.equal(); // Calculate the result of the first operation
      }

      this.symbol = symbol; // Set the operator
      this.isSecondValue = true; // Start entering the second value
      this.currentValue = ''; // Reset the current input value for the second number

      console.log('Symbol:', this.symbol);
    }

    // Log values for debugging
    console.log('First Value:', this.firstValue);
    console.log('Second Value:', this.secondValue);
    console.log('Current Value:', this.currentValue);
  }

  // Perform the calculation when the equals button is clicked
  equal() {
    let num1 = parseFloat(this.firstValue);
    let num2 = parseFloat(this.secondValue);

    // If secondValue is not yet entered, just return
    if (!this.secondValue) {
      return;
    }

    switch (this.symbol) {
      case '+':
        this.result = num1 + num2;
        break;
      case '-':
        this.result = num1 - num2;
        break;
      case '*':
        this.result = num1 * num2;
        break;
      case '/':
        this.result = num1 / num2;
        break;
      case '%':
        this.result = num1 % num2;
        break;
      default:
        this.result = 'Error';
    }
    this.finalResult = Number(this.result);
    // Log the result of the operation
    console.log('Result:', this.result);

    // Set the result to firstValue for further operations
    this.firstValue = this.result.toString();
    this.secondValue = '';
    this.isSecondValue = false;
    this.currentValue = this.firstValue; // Display the result as currentValue
  }

  // Clear the calculator (reset all values)
  clear() {
    this.firstValue = '';
    this.secondValue = '';
    this.symbol = '';
    this.result = 0;
    this.currentValue = '';
    this.isSecondValue = false;
    this.finalResult = 0;
  }

  // Add keyboard support
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.key;

    if (!isNaN(Number(key))) {
      // Handle number keys (0-9)
      this.getAction(Number(key));
    } else if (key === '.') {
      // Handle decimal point
      this.getAction('.');
    } else if (key === '+') {
      this.getAction('+');
    } else if (key === '-') {
      this.getAction('-');
    } else if (key === '*') {
      this.getAction('x'); // We mapped 'x' to '*' in getAction()
    } else if (key === '/') {
      this.getAction('÷'); // We mapped '÷' to '/' in getAction()
    } else if (key === '%') {
      this.getAction('%');
    } else if (key === 'Enter' || key === '=') {
      // Handle Enter key for equals
      this.equal();
    } else if (key === 'Backspace') {
      // Handle Backspace for clearing input
      this.clear();
    }
  }
}
