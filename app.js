
let UIController = (function(){
    const DOMStrings = {
        submitBtn:'.input__btn',
        inputDesc:'.input__desc',
        inputValue:'.input__value',
        inputType:'.input__type',
        budgetDisplay:'.display__budget',
        incomeDisplay:'.display__income',
        expensesDisplay:'.display__expense',
        percentageDisplay:'.display__percentage'
    };

    const DOMElements = {
        incomeLabel:document.querySelector(DOMStrings.incomeDisplay),
        expenseLabel:document.querySelector(DOMStrings.expensesDisplay),
        budgetLabel:document.querySelector(DOMStrings.budgetDisplay),
        percentageLabel:document.querySelector(DOMStrings.percentageDisplay)
    };

    const inputFields = {
        type:document.querySelector(DOMStrings.inputType).value,
        description:document.querySelector(DOMStrings.inputDesc).value,
        value:document.querySelector(DOMStrings.inputValue).value
    }

    return{
        getDOMStrings:function(){
            return DOMStrings;
        },

        getInput:function(){
            return inputFields;
        },
        clearFields:function(){
            document.querySelector(DOMStrings.inputDesc).value = '';
            document.querySelector(DOMStrings.inputValue).value = '';

            document.querySelector(DOMStrings.inputDesc).focus();


            
        },

        getDOMElements:function(){
            return DOMElements;
        }
    }
})();

let BudgetController = (function(){
    let Income = function(ID,description,value){
        this.value = value;
        this.description = description;
        this.ID = ID;
    }
    let Expense = function(ID,description,value){
        this.value = value;
        this.description = description;
        this.ID = ID;
    }


    let data;

    data = {
        allItems:{
            inc:[],
            exp:[]
        } ,
        
        totals:{
            inc:0,
            exp:0
        },

        budget:0,
        percentage:-1
    }


    return{
        addItem:function(type,description,value){
            let currentItem,id;

            // if(data.allItems[type].length === 0){
            //     id = 0;
            // }
            // else{
            //     id = data.allItems[type].length;
            // }
            id = data.allItems[type].length;


            if (type === 'inc'){
                currentItem = new Income(id,description,value);
            }
            else if(type === 'exp'){
                currentItem = new Expense(id,description,value);
            }

            data.allItems[type].push(currentItem);
        },
        getData:function(){
            return{
                budget:data.budget,
                income:data.totals.inc,
                expenses:data.totals.exp,
                percentage:data.percentage
            }
            
        },
        calculateBudget:function(){
            let totalBudget,totalIncome,totalExpenses;
            
            // get the total income
            data.allItems.inc.forEach(item=>{
                data.totals.inc += item.value;
            });
            data.totals.inc = parseFloat(data.totals.inc);
            // get the total expense
            data.allItems.exp.forEach(item=>{
                data.totals.exp += item.value;
            });
            //get the budget
            data.budget = data.totals.inc - data.totals.exp;

        }
        
    }
})();

let controller = (function(UICtrl,BudgetCtrl){
    const DOMStrings = UICtrl.getDOMStrings();

    function setEventHandlers(){

        document.querySelector(DOMStrings.submitBtn).addEventListener('click',ctrlAddItem);

        window.addEventListener('keypress',(e)=>{
            if(e.keyCode === 13 || e.which === 13){
                ctrlAddItem();
            }
        });
    }

    function ctrlAddItem(){
        let input,DOMelements,data;

        input = UICtrl.getInput();
        DOMelements = UICtrl.getDOMElements();
        if(input.description != '' && !isNaN(input.value) && input.value > 0){

            BudgetCtrl.addItem(input.type,input.description,input.value);
            BudgetCtrl.calculateBudget();
            data = BudgetCtrl.getData();
            // display it to the UI
            console.log(data);
            DOMelements.budgetLabel.textContent = data.budget;
            DOMelements.incomeLabel.textContent = data.income;
            DOMelements.expenseLabel.textContent = data.expenses;

            UICtrl.clearFields();
        }
        else{
            alert('Error');
        }
 
     
    }



    return{
        init:function(){
            // UICtrl.clearFields();
            setEventHandlers();
        }
    }

 
})(UIController,BudgetController);

controller.init();