
/*
  by: lucieudo.roberto@gmail.com 2023
  dont remove credits
*/

var RUN_STATE = false 
var RUN_INTVL = false

const app = {
    ram_memory : new Array(135).fill(0),
    acumulator : 0,
    pg_counter : 0,
    
    h2d : h => parseInt(h, 16),
    d2h : d => (+d).toString(16),
    
    printd_ram : function(stroke) {
        let out_container = document.getElementById('ram-grafic')
        out_container.innerHTML = ''
       
        for ( let i=0; i<this.ram_memory.length; i++ ) {
            if ( i == stroke ) {
                out_container.innerHTML += `<i style="color:red" class='r-g-i'>${this.ram_memory[i]}</i>`;
            }else {
                out_container.innerHTML += `<i class='r-g-i'>${this.ram_memory[i]}</i>`;
            }
        }
    },
    
    write_to_ram : function(code) {
        for ( let cell=0; cell < code.length; cell++ ) {
            this.ram_memory[cell] = code[cell]
        }
        return true
    },
    
    execute_code : function(binary_code,delay) {
        let show_pgc = document.getElementById('pe-val')
        let show_end = document.getElementById('cp-val')
        let show_acm = document.getElementById('ac-val')
        let show_log = document.getElementById('logs')
        let raw_graf = document.querySelectorAll(".r-g-i");

        // procurando em qual índice está o label main
        let byte_cell = binary_code.findIndex(x => x == '80');
            byte_cell = ( byte_cell == -1 ) ? 0 : byte_cell;
               
        RUN_INTVL = setInterval(() => {
            let byte = binary_code[byte_cell];
            this.printd_ram(byte_cell)

            byte = ( byte == undefined ) ? 0 : this.h2d(byte);

            let code_state = neander.run(byte)

            switch ( code_state ) {
                case 10: //WAITING
                    show_log.innerText = "aguardando operando"
                    byte_cell += 1
                break;
                case 30: //NOT
                    show_log.innerText = "bits invertidos"
                    byte_cell += 1
                break;
                case 20: //NOP
                    show_log.innerText = "sem operação"
                    byte_cell += 1
                break;
                case 40: //HLT
                    clearInterval(RUN_INTVL);
                    RUN_STATE = false
                    document.getElementById('run-bnt').innerText = "RUN"
                    show_log.innerText = "programa encerrado"
                    byte_cell = 0
                break;
                case 50: //ROTULO M
                    show_log.innerText = "rotulo main"
                    byte_cell += 1
                break;
                case 60: //ROTULO N
                    show_log.innerText = "rotulo normal"
                    byte_cell += 1
                break;

                case 'a2r': //STA
                    show_log.innerText = "ram = ac"
                    this.ram_memory[byte] = this.d2h(neander.ac);
                    byte_cell += 1
                break;
                case 'r2a': //LDA
                    show_log.innerText = "ac = ram"
                    neander.ac = this.h2d(this.ram_memory[byte])
                    byte_cell += 1
                break;
                case 'aAr': //ADD
                    show_log.innerText = "ac += ram"
                    neander.ac += this.h2d(this.ram_memory[byte])
                    byte_cell += 1
                break;
                case 'aOr': //OR
                    show_log.innerText = "ac || ram"
                    neander.ac = ( neander.ac | this.h2d(this.ram_memory[byte_cell]))
                    byte_cell += 1
                break;
                case 'aEr': //AND
                    show_log.innerText = "ac && ram"
                    neander.ac = ( neander.ac & this.h2d(this.ram_memory[byte_cell]))
                    byte_cell += 1
                break;
                case 'jmp': //JMP
                    show_log.innerText = "salto"
                    byte_cell = byte
                break;
                
                default:
                    byte_cell += 1;
                break;
            }
            
            show_acm.innerText = neander.ac;
            show_end.innerText = this.pg_counter;
            this.pg_counter += 1;
        },delay)

    }
}



function get_variables() {
     let variables = document.getElementById('vars').value.replaceAll(" ","");
     const reg_lv0 = /([\d]{1,3}:[\d]{1,3})/gm
     if ( variables.length > 0 ) {
         let vars = variables.match(reg_lv0)
         return (vars.length > 0 ) ? vars : false
     }
     return false;
}


function save_code() {
    let vars = document.getElementById('vars').value;
    let code = document.getElementById('code').innerText;
    
    if ( vars.length > 0 & code.length > 0 ) {
        window.localStorage.setItem("neander_code",code)
        window.localStorage.setItem("neander_vars",vars)
    }
}

function load_code() {
     let code = window.localStorage.getItem("neander_code")
     let vars = window.localStorage.getItem("neander_vars")
     
     try {
         if (vars.length > 0 & code.length > 0) {
            document.getElementById('vars').value = vars;
            document.getElementById('code').innerText = code;
         }
     }catch(error){}
}


function read_code() {
    let code_raw = document.getElementById('code').innerText
    let show_log = document.getElementById('logs')
    let butt_lbl = document.getElementById('run-bnt')
    let time_run = document.getElementById('cpu-time').value
    
    RUN_STATE = ! RUN_STATE // controle de start e stop
    
    butt_lbl.innerText = ( RUN_STATE ) ? "STOP" : "RUN";
    
    if ( code_raw.length ==0 ) {
        show_log.innerText = "Sem códico na memória"
        RUN_STATE = false
        butt_lbl.innerText = "RUN"
        return false;
    }
    
    if ( RUN_STATE == false ){
        clearInterval(RUN_INTVL);
        neander.ac = 0;
        app.pg_counter = 0;
        return;
    }

    try {
        // tokenizando, analizando sintax e compilando
        var code_toknezed = code_prepare.sanatize(code_raw);
        var code_analized = code_prepare.analize_sintax(code_toknezed)
        var code_compiled = compiler(code_analized)
    
    }catch( error ) {
        show_log.innerText = error;
        return false;
    }
    
    if (typeof code_analized != 'object') {
        // uma string será retorna em erros de sintax
        show_log.innerText = code_analized;
        return false;
    }
    
    // escrevendo códico na memoria ram
    app.write_to_ram(code_compiled);
    app.printd_ram()

    let variables = get_variables()
    
    if ( typeof variables == 'object') {
        for ( let x=0; x<variables.length; x++ ) {
            let data = variables[x].split(":");
            app.ram_memory[data[0]] = app.d2h(data[1])
        }
    }
    
    app.execute_code(code_compiled,time_run);
    save_code();
}


window.onload = function(){ load_code();}

/*

main:
  lda 80 ; A
  add 80  
  add 81 ; B
  jn negativo
  lda 80
  add 80
  add 81
  sta 89
  add 89
  sta 83 ; C
  lda 83
  hlt

negativo:
    lda 80
    add 80
    not 
    add 84 ; 1
    add 82
    add 82
    sta 83
    lda 83
    hlt

*/