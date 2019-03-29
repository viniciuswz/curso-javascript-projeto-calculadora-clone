class CalcController {
    
    constructor(){
        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector('#display');
        this._timeEl = document.querySelector('#hora');
        this._dateEl = document.querySelector('#data');
        this._currentDate;
        this._operation = [];
        this._temporaryOperation;
        this.initialize(); 
        this.initButtonsEvents();
    }
    
    initialize(){
        // this._displayCalcEl.innerHTML = '4567';
        // this._timeEl.innerHTML = "10:00";
        // this._dateEl.innerHTML = "20/02/2019";
        this.initKeyboard()
        this.setDisplayDateTime();
        setInterval(()=>{
            this.setDisplayDateTime();
        },1000);

        document.querySelectorAll('.btn-ac').forEach(item=>{
            item.addEventListener('dblclick',e=>{
                this.toggleAudio();
                
            })
        })
    }
    

    toggleAudio(){
        this._audioOnOff = !this._audioOnOff; 
    }

    playAudio(){
        if(this._audioOnOff){
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }
    setDisplayDateTime(){ //data e hora atualmente
        this.displayDate = this.currentDate.toLocaleDateString(this._locale)
        this.displayTime = this.currentDate.toLocaleTimeString(this.locale);
    }
    
    addEventListenerAll(element,events,fn){
        events.split(' ').forEach(event=>{
            element.addEventListener(event, fn , false)
        });
    }
    
    clearAll(){
        this._operation = [];
        this._temporaryOperation = '';
        this.displayCalc = ''
    }
    
    clearEntry(){
        this._temporaryOperation = this._temporaryOperation.slice(0,-1)
        this.displayCalc = this.showDisplay();
    }
    
    setError(){
        this.displayCalc = 'error';
    }
    
    addOperation(value){

        if(value == ''){
            return false
        }
         this._operation.push(value)
         return  console.log(this._operation);
       // console.log(this._operation[this._operation.length])
    }
    
    isOperator(value){
        return ['+','-','*','/','%'].some((index)=>{
            return index == value;
        })
    }

    islastPosition(){
       return this._operation[this._operation.length - 1];//
    }
    
    isSignal(value){
        let signal;

        if(!this.isOperator(value)){
            signal = this.convertSignal(value);
        }else{
            signal = value;
        }

        if( this.isOperator(signal) && !this._temporaryOperation && this._operation.length > 1 ){
            this._operation.pop();
            this._operation.push(signal);
            
        }else if(signal == '='){
            this.isEqual(this._operation);
            
        }else{
            this.addOperation(Number(this._temporaryOperation))
            this.addOperation(signal);
            this._temporaryOperation = '';
            this.pushOperation();
        }
        
    }
    
    isNumber(value){
        
        if(!isNaN(value)){
            this.addNumber(value);
            //console.log(this._temporaryOperation);
            
        }else{
            this.isSignal(value);
        }
        this.displayCalc = this.showDisplay();
    }

    addNumber(value){
        if(!this._temporaryOperation && value != '.'){
            this._temporaryOperation = value;
        }else{
            this._temporaryOperation += value;
        }
    }

    addSignal(value){
        if(value != '.' && this._operation.length == 0){
            //this._temporaryOperation = value
        }else{
            this._temporaryOperation += value;
        }
    }
    
    makeCalc(value){

        if(this._operation[1] ==  '%'){
            return this.displayCalc =   eval(`(${this._operation[0] * this._operation[2]})/ 100`)
        }
        let result = eval(value.join(''));
        return this.displayCalc = result
        
    }

    pushOperation(){
        if(this._operation.length > 3){
            let signal = this._operation.pop();
            this._operation.splice(0,3,this.makeCalc(this._operation));
            this._operation.push(signal);
            console.log(this._operation);
        }
    }

    isEqual(array){
        this._operation.push(this._temporaryOperation);
        this._temporaryOperation = '';
        if(array.length == 3){
            this._operation.splice(0,3,this.makeCalc(this._operation));
        }else{
            this.setError();
        }
    }
    
    showDisplay(){
        if(this._operation.length >= 1){
           return  `${this._operation.join('')}${this._temporaryOperation}`;
        }else{
           return this._temporaryOperation
        }
    }

    convertSignal(signalName){
        switch(signalName){
            case 'soma':
            return '+';
            case 'subtracao':
            return '-';
            case 'divisao':
            return '/';
            case 'multiplicacao':
            return '*';
            case 'porcento':
            return '%';
            case 'igual':
            return '='
            case 'ponto':
            return '.'
            default:
            this.setError();
        }
    }
    
    execBtn(value){
        this.playAudio();
        switch(value){
            case 'ac':
            this.clearAll();
            break;
            case 'ce':
            this.clearEntry();
            break;
            case 'soma':
            case 'subtracao':
            case 'divisao':
            case 'multiplicacao':
            case 'porcento':
            this.isNumber(value)
            break;
            
            case 'ponto':
            this.addNumber(this.convertSignal(value));
            break;
            case 'igual':
            this.isNumber(value);
           
            break;
            
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            this.isNumber(value);
            break
            default:
            this.setError();
            break
        }
    }
    
    initButtonsEvents(){
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");
        
        buttons.forEach((item,index)=>{
            this.addEventListenerAll(item,'click drag',e=>{
                let text = item.className.baseVal.replace('btn-','');
                this.execBtn(text);
            });
            
            this.addEventListenerAll(item,'mouseover mouseip mousedown',e=>{
                item.style.cursor = 'pointer';
            });
            
        });
        
        
    }
    
    initKeyboard(){
        this.playAudio();
        document.addEventListener('keyup',(e)=>{
            this.playAudio();
           console.log(e.key);

           switch(e.key){
            case 'Escape':
            this.clearAll();
            break;
            case 'Backspace':
            this.clearEntry();
            break;
            case '+':
            case '-':
            case '/':
            case '*':
            case '%':
            this.isNumber(e.key)
            break;
            
            case '.':
            case ',':
            this.addNumber('.');
            break;
            case '=':
            case 'Enter':
            this.isNumber('igual');
           
            break;
            
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            this.isNumber(e.key);
            break;
           
           
           }
        })
    }
    
    
    
    
    get displayTime(){ // pegar valor do visor da hora
        return this._timeEl.innerHTML;
    }
    
    set displayTime(time){// adicionar um valor da hora no visor
        this._timeEl.innerHTML = time;
    }
    
    get displayDate(){ // pegar a data do visor
        return this._dateEl.innerHTML;
    }
    
    set displayDate(date){// adicionar valor da data no visor
        return this._dateEl.innerHTML = date;
    }
    
    get displayCalc(){ // Pego o valor do visor
        return this._displayCalcEl.innerHTML; 
    }
    
    set displayCalc(value){ // Adiciono um valor ao visor
        if(value.toString().length > 10){
            this.setError();
            return false
        }
        this._displayCalcEl.innerHTML = value ;
    }
    
    get currentDate(){ // Pego um objeto com as informações de hora/data
        return new Date();;
    }
    
    set currentDate(date){ // ??
        this._currentDate = date;
    }
    
}