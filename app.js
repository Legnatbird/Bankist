'use strict';
// BANKIST APP
// Data
const account1 = {
  owner: 'Alejandro Quiñones Caicedo',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 8277,
};

const account2 = {
  owner: 'Isabella Andrea Bedoya García',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2304,
};

const account3 = {
  owner: 'Blanca Libia Caicedo Alvarez',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 2320,
};

const account4 = {
  owner: 'Diego Fernando Quiñones Caicedo',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 1224,
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
  displayMovements(acc.movements);
  
  //Display balance
  calcDisplayBalance(acc);
  
  //Display summary
  calcDisplaySummary(acc);
};
//--------DISPLAYS CALC-----------//
const calcDisplayBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc,current) => acc + current, 0);
  labelBalance.textContent = `${acc.balance} $`;
};

const calcDisplaySummary = function(acc) {
  const incomes = acc.movements
  .filter(mov => mov > 0)
  .reduce((acc,mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}$`;
  
  const out = acc.movements
  .filter(mov => mov < 0)
  .reduce((acc,mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}$`;
  
  const interest = acc.movements
  .filter(move => move > 0)
  .map(deposit => deposit * acc.interestRate / 100)
  .filter((int) => int >= 1)
  .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}$`;
};

//--------USER STATE-----------//
let currentAccount;
let sorted = false;

//--------EVENT HANDLERS--------------//
btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  if (currentAccount?.pin === Number(inputLoginPin.value)){
    //Display UI and message
    labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(" ")[0]}`;
    containerApp.style.opacity = 100;
    
    //Clear fields and lost focus
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    inputLoginUsername.blur();
    
    updateUI(currentAccount);
  };
});

const displayMovements = function(movements, sort = false) {
  containerMovements.innerHTML = "";
  
  const moves = sort ? movements.slice().sort((a,b) => a - b) : movements; 
  
  moves.forEach((movement,index) => {
    let type = (movement > 0 ) ? "deposit" : "withdrawal";
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${index + 1} ${type}</div>
    <div class="movements__value">${movement}$</div>
    </div>
    `;
    
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  
  if (amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username){
    //Doing transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  };

  inputTransferAmount.value = inputTransferTo.value = "";
});

btnLoan.addEventListener("click",(e) => {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);

  if (loanAmount > 0 && currentAccount.movements.some(move => move >= loanAmount / 10)){
    //Add movement
    currentAccount.movements.push(loanAmount);
    //Update UI
    updateUI(currentAccount);
    //Lost focus
    inputLoanAmount.blur();
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click",(e) => {
  e.preventDefault();
  if (currentAccount.pin === Number(inputClosePin.value) && currentAccount.username === inputCloseUsername.value) {
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