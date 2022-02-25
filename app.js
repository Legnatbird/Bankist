'use strict';
// BANKIST APP
// Data
const account1 = {
  owner: 'Alejandro Quiñones Caicedo',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 8277,

  movementsDates: [
    '2022-01-01T21:31:17.178Z',
    '2022-01-13T07:42:02.383Z',
    '2022-01-15T09:15:04.904Z',
    '2022-01-16T10:17:24.185Z',
    '2022-01-29T14:11:59.604Z',
    '2022-02-12T17:01:17.194Z',
    '2022-02-18T23:36:17.929Z',
    '2022-02-23T10:51:36.790Z',
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
    '2022-01-01T13:15:33.035Z',
    '2022-01-12T09:48:16.867Z',
    '2022-01-14T06:04:23.907Z',
    '2022-01-25T14:18:46.235Z',
    '2022-01-30T16:33:06.386Z',
    '2022-01-31T14:43:26.374Z',
    '2022-02-21T18:49:59.371Z',
    '2022-02-24T12:01:20.894Z',
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
    '2022-01-12T21:31:17.178Z',
    '2022-01-23T07:42:02.383Z',
    '2022-01-28T09:15:04.904Z',
    '2022-01-28T21:31:17.178Z',
    '2022-01-29T07:42:02.383Z',
    '2022-01-30T09:15:04.904Z',
    '2022-01-31T14:18:46.235Z',
    '2022-02-22T16:33:06.386Z',
  ],
};

const account4 = {
  owner: 'Diego Fernando Quiñones Caicedo',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 1224,

  movementsDates: [
    '2022-01-13T14:18:46.235Z',
    '2022-01-15T16:33:06.386Z',
    '2022-01-22T14:18:46.235Z',
    '2022-02-10T16:33:06.386Z',
    '2022-02-15T21:31:17.178Z',
    '2022-02-17T16:33:06.386Z',
    '2022-02-23T14:43:26.374Z',
    '2022-02-24T18:49:59.371Z',
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

//--------FUNCTIONS-----------//
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

const displayMovements = function(acc, sort = false) {
  containerMovements.innerHTML = "";
  
  const moves = sort ? acc.movements.slice().sort((a,b) => a - b) : acc.movements;
  
  moves.forEach((movement,index) => {
    let date = new Date(acc.movementsDates[index]);
    let displayDate = formatMovementDate(date);

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

const formatMovementDate = function(date) {
  const calcDaysPassed = (date1, date2) => Math.round(Math.abs((date2 - date1)/(1000 * 60**2 * 24)));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <=  7) return `${daysPassed} days ago`;
  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();
    
  return `${day}/${month}/${year}`;
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

    //Set date
    const date = new Date();
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const day = `${date.getDate()}`.padStart(2, 0);
    const hour = `${date.getHours()}`.padStart(2, 0);
    const min = `${date.getMinutes()}`.padStart(2,0);

    labelDate.textContent = `${day}/${month}/${year} ${hour}:${min}`;
    
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
    displayMovements(currentAccount, !sorted);
    sorted = !sorted;
});