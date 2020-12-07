'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
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



const displayMovements=function(movements,sort=false){
  containerMovements.innerHTML=''; // intializing empty sort of thing

  const movs=sort ?movements.slice().sort((a,b)=>a-b) : movements; //Here i have used slice to make duplicate copy of movments array as sort function mutated the movements arrays

  movs.forEach(function(mov,i){

    const type=mov>0 ? 'deposit' : 'withdrawal';

    const html=` 
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${mov}</div>
    
    `;

    containerMovements.insertAdjacentHTML('afterbegin',html);
  })
};

const calDisplayBalance=function(acc){

  acc.balance=acc.movements.reduce((acc,mov)=>acc+mov,0);
  labelBalance.textContent=`${acc.balance} INR`;
};
 

const calDisplaySummary=function(acc){
      const incomes=acc.movements.filter(mov=> mov>0).reduce((acc,mov)=>acc+mov,0);
      labelSumIn.textContent=`${incomes} INR`;
      // console.log(incomes);

      const out=acc.movements.filter(mov=> mov<0).reduce((acc,mov)=>acc+mov,0);
      labelSumOut.textContent=`${Math.abs(out)} INR`;

      const interest=acc.movements.filter(mov=>mov>0).map(deposit =>(deposit*acc.interestRate)/100).filter((int,i,arr)=>{
        console.log(arr);
        return int>=1;
      })
        .reduce((acc,int)=>acc+int,0);
        labelSumInterest.textContent=`${interest} INR`;

};



const createUsernames=function(acc){                                     
    acc.forEach(function(acc){                                        //There we use forEach loop beacuse,the parameter passed is an object named account ,we have to make change in the same object and not create a new object
       acc.username=acc.owner.toLowerCase().split(' ').map(function(name){        //There we use map because map create a new array to store the usernames of the accounts
        return name[0];
      }).join('');
    });
};
createUsernames(accounts);

 const updateUI=function(acc){
    //Display movements
    displayMovements(currentAccount.movements);
    //Display Balnce
    calDisplayBalance(currentAccount);
    //Display summary
    calDisplaySummary(currentAccount);
    
 }

//Event handler

let currentAccount;

btnLogin.addEventListener('click',function(e){
  //Prevent from submitting
  e.preventDefault();

  currentAccount=accounts.find(acc=>acc.username===
    inputLoginUsername.value);
    console.log(currentAccount);

    if(currentAccount?.pin===Number(inputLoginPin.value)){   // There if the current account exsits then only it will be read that is done by ?

      //Display UI and message
      labelWelcome.textContent=`Welecome back ${currentAccount.owner.split(' ')[0]}`;
      containerApp.style.opacity=100;

      //Clear the input fields
      inputLoginUsername.value=inputLoginPin.value='';
      inputLoginPin.blur();   //This is a property which help loose the focus of the PIN field
      
      //Update UI
      updateUI(currentAccount);
    }
});

// Transfer implementation

btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  const amount =Number(inputTransferAmount.value);
  const receiverAcc=accounts.find(
    acc=>acc.username=== inputTransferTo.value
  );
  inputTransferAmount.value=inputTransferTo='';
  //Condition for transferring 
  if(amount>0 && receiverAcc && currentAccount.balance>=amount && receiverAcc?.username!==currentAccount.username ){
    //Doing the tranfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Update UI
    updateUI(currentAccount);

  }

});
btnLoan.addEventListener('click',function(e){
  e.preventDefault();

  const amount=Number(inputLoanAmount.value);
  if(amount>0 && currentAccount.movements.some(mov=>mov>=amount *0.1)){
    //Add movement i.e credit the loan in the account
    currentAccount.movements.push(amount);
    //Update the UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value='';

});






btnClose.addEventListener('click',function(e){
  e.preventDefault();
  
  console.log('Delete');
  if(currentAccount.username===inputCloseUsername.value && currentAccount.pin===Number(inputClosePin.value)){
    
    const index=accounts.findIndex(acc=>acc.username===currentAccount.username);  
    console.log(index);
    //Delete account
    accounts.splice(index,1);

    //Hide UI
    containerApp.style.opacity=0;
  }
  inputClosePin.value=inputClosePin.value='';

 
});

let sorted=false;    //Here i have used sorted variable because if you once click on sort button it will sort,but what about next time you click it ,for the same purpose of getting it base to normal again i have used sorted variable
btnSort.addEventListener('click',function(e){
e.preventDefault();
displayMovements(currentAccount.movements,sorted)
sorted=!sorted;

});

