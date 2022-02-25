'use strict';
// BANKIST APP
// Data
const account1 = {
  owner: 'Alejandro Quiñones Caicedo',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 8277,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Isabella Andrea Bedoya García',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2304,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Blanca Libia Caicedo Alvarez',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 2320,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
  ],
};

const account4 = {
  owner: 'Diego Fernando Quiñones Caicedo',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 1224,

  movementsDates: [
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2019-11-18T21:31:17.178Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
  ]
};

const accounts = [account1, account2, account3, account4];

//--------HTML ELEMENTS----------//
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//---------UTILS----------//
//--------CREATE USERNAMES---------//
const createUserName = (accs) => accs.forEach((acc) => {
  acc.username = acc.owner
  .toLowerCase()
  .split(" ")
  .map(name => name[0])
  .join("")
});
createUserName(accounts);

//---------UPDATE USER UI-----------//
const updateUI = function(acc) {
  //Display movements
  displayMovements(acc);
  
  //Display balance
  calcDisplayBalance(acc);
  
  //Display summary
  calcDisplaySummary(acc);
};

const displayMovements = function(acc, sort = false) {
  containerMovements.innerHTML = "";
  
  const moves = sort ? acc.movements.slice().sort((a,b) => a - b) : acc.movements;
  
  moves.forEach((movement,index) => {
    let date = new Date(acc.movementsDates[index]);
    let day = `${date.getDate()}`.padStart(2, 0);
    let month = `${date.getMonth() + 1}`.padStart(2, 0);
    let year = date.getFullYear();
    let displayDate = `${day}/${month}/${year}`;

    let type = (movement > 0 ) ? "deposit" : "withdrawal";

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${index + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${movement.toFixed(2)}$</div>
    </div>
    `;
    
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
//--------DISPLAYS CALC-----------//
const calcDisplayBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc,current) => acc + current, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)} $`;
};

const calcDisplaySummary = function(acc) {
  const incomes = acc.movements
  .filter(mov => mov > 0)
  .reduce((acc,mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}$`;
  
  const out = acc.movements
  .filter(mov => mov < 0)
  .reduce((acc,mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}$`;
  
  const interest = acc.movements
  .filter(move => move > 0)
  .map(deposit => deposit * acc.interestRate / 100)
  .filter((int) => int >= 1)
  .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}$`;
};

//--------USER STATE-----------//
let currentAccount;
let sorted = false;

//--------EVENT HANDLERS--------------//
btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  if (currentAccount?.pin === +inputLoginPin.value){

    //Display UI and message
    labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(" ")[0]}`;
    containerApp.style.opacity = 100;
    
    //Clear fields and lost focus
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    inputLoginUsername.blur();

    //Current Date
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const minutes = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;

    updateUI(currentAccount);
  };
});

btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  
  if (amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username){
    //Doing transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Add  transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    //Update UI
    updateUI(currentAccount);
  };

  inputTransferAmount.value = inputTransferTo.value = "";
});

btnLoan.addEventListener("click",(e) => {
  e.preventDefault();
  const loanAmount = Math.floor(inputLoanAmount.value);

  if (loanAmount > 0 && currentAccount.movements.some(move => move >= loanAmount / 10)){
    //Add movement
    currentAccount.movements.push(loanAmount);

    //Add loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    //Update UI
    updateUI(currentAccount);

    //Lost focus
    inputLoanAmount.blur();
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click",(e) => {
  e.preventDefault();
  if (currentAccount.pin === +inputClosePin.value && currentAccount.username === inputCloseUsername.value) {
    let i = accounts.findIndex(acc => acc.username === currentAccount.username);
    //Delete account
    accounts.splice(i,1);

    //Ocult the container
    containerApp.style.opacity = 0;

    //Welcome messagge
    labelWelcome.textContent = "Log in to get started";
  };
  //Clean fields
  inputClosePin.value = inputCloseUsername.value = "";
})

btnSort.addEventListener("click",(e) => {
    e.preventDefault();
    displayMovements(currentAccount.movements, !sorted);
    sorted = !sorted;
});