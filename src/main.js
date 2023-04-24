
/*
  by: lucieudo.roberto@gmail.com 2023
  dont remove credits
*/


var MXD = 135 // quantidade máxima de ram
var ACM = 0   // acumulador
var CPC = 0 
var PWR = 0   // power button

var RAM = new Array(MXD).fill(0)


const app = {
    _id: x => document.getElementById(x),
    
    _cp: x => {
        x.forEach((x,i)=> RAM[i] = x)
    },
  
    _d2h: d => (+d).toString(16),
    _h2d: h => parseInt(h, 16),
    
    clean_ram: function() { 
        RAM.fill(0); 
        this.print_ram()
    },
    
    print_ram: function(blink=-1) {
        let out = this._id('ram-grafic'); out.innerHTML = '';
        
        RAM.forEach((x,i)=>{
            if (blink > 0 && i == blink ) {
                 out.innerHTML += `<i style='background:#6eb8f5' id='rgi_${i}' class='r-g-i'>${x}</i>`;
            }else {
                 out.innerHTML += `<i id='rgi_${i}' class='r-g-i'>${x}</i>`;
            }
        })
    },
    
    write_ram: function() {
        let src_code = this._id("code").innerText;
        let out_logs = this._id("logs")
        
        if ( src_code.length > 3 ) {
            let code_parsed = analize.parsing(src_code);
            
            if (typeof code_parsed == 'object' ) {
                this._cp(compiler(code_parsed))
                this.print_ram()
                out_logs.innerText = 'códico gravado na ram!';
                return true
            }
            
            this.print_ram()
            out_logs.innerText = code_parsed;
            return false;
        }
    },
    
    exect_cod : function() {
        let speed = this._id('cpu-time').value
        let stbnt = this._id('exect')
        let logss = this._id('logs')
        
        let acvalue = this._id("ac-val")
        let cpvalue = this._id("cp-val")
        let infinti = this._id("pe-val")
        
        let cell = 0
        let infint = 0;
       

        var control = setInterval(()=>{
           let byte = this._h2d(RAM[cell]);
           this.print_ram(cell)

            state = neander.ula(byte);
            
            if ( state == true) {
                logss.innerText = 'wating operand'
                cell += 1;
            }
            if ( typeof state == 'string' ) {
                if (state == 'stop') {
                    logss.innerText =' PG Finish..'
                    neander.ac = 0;
                    clearInterval(control);
                    return;
                }
                logss.innerText = state;
                cell += 1;
            }else if (typeof state == 'number'){
                cell = byte;
            }
            
            
            acvalue.innerText = neander.ac;
            cpvalue.innerText = cell;
            infinti.innerText = infint;
            if (!PWR) clearInterval(control);
            infint++;

        },speed) 
        
        
        PWR = ~ PWR
        stbnt.innerText = (stbnt.innerText == 'START') ? "STOP" : "START"
    } 
}