
/*
  by: lucieudo.roberto@gmail.com 2023
  dont remove credits
*/

var COMMDS = {
    nop:1,sta:6,lda:2,add:7,
    and:3,not:8,jmp:4,hlt:9,
    jn:10,jz:11,
    or:12
}

var COMMDS_3 = {
    equ: 1,
    atb: 2
}


const code_prepare = {
    
    _tokenize : ( raw_code ) => {
        let out_code = raw_code.toLowerCase().split('\n')
        let aux = []
        
        for ( let x=0; x<out_code.length; x++ ) {
            aux.push(out_code[x].replace(/\s+/g, " ").trim())
        }
        return aux;
     },
    
    sanatize : function( code_in ) {
        let code_out = []
        code_in = this._tokenize(code_in);
       
        const reg_lv0 = /^([\w]{1,20}:)/gm
        const reg_lv1 = /^(?![^:]*:)[a-z]{2,3}/gm
        const reg_lv2 = /^([a-z]{1,3}[ ]{1,30}[\w]{1,20})/gm
        const reg_lv3 = /^([\w]{1,30}[ ]{1,30}[a-z]{1,3}[ ]{1,30}[0-9]{1,3})/gm
        
        for ( let x=0; x<code_in.length; x++ ) {
            if (code_in[x].match(reg_lv3) !== null){code_out.push(code_in[x].match(reg_lv3)[0]); continue;}
            if (code_in[x].match(reg_lv2) !== null){code_out.push(code_in[x].match(reg_lv2)[0]); continue;}
            if (code_in[x].match(reg_lv1) !== null){code_out.push(code_in[x].match(reg_lv1)[0]); continue;}
            if (code_in[x].match(reg_lv0) !== null){code_out.push(code_in[x].match(reg_lv0)[0]); continue;}
        }
        
        return code_out;
    },
    
    analize_sintax : function(raw_code) {
        let line_raw;
        let commands = 0;
        let LABELS = {};
        let SUGARS = {};
    
        for ( let line = 0; line < raw_code.length; line++ ) {
               line_raw = raw_code[line].split(" ")
               switch (line_raw.length) {
                   case 1:
                       if (line_raw[0].charAt(line_raw[0].length - 1) == ':') {
                           if (LABELS[line_raw[0].substr(0, line_raw[0].length - 1)] != undefined) {
                               return `rótulo duplicado!`;
                           }
                           let label_name = line_raw[0].substr(0, line_raw[0].length - 1)
                           LABELS[label_name] = commands;
                       }
                       else if (COMMDS[line_raw[0]] == undefined) {
                           return `comando inválido`;
                       }
                       commands += 1;
                       break;
                   case 2:
                        commands +=2;
                   break;
               }
        }
        
        for ( let line = 0; line < raw_code.length; line++ ) {
           line_raw = raw_code[line].split(" ")
           // resolver erro do label ter um numeracao errada, pois esta contando linhas, nao comandos
           switch(line_raw.length) {
                case 2:
                    if ( COMMDS[line_raw[0]] == undefined ){return `erro na linha: ${line}, comando inválido`;}
                    
                    if ( !isNaN( line_raw[1])) {
                        let val = parseInt( line_raw[1] );
                        if (val < 0 || val >= 128 ) {
                            return `valor inváldio`;
                        }
                    }else if (line_raw[0].charAt(0) == 'j') {
                        if (LABELS[line_raw[1]] == undefined) {
                            return `rotúlo não declarado`;
                        }
                    }else {
                        if ( SUGARS[line_raw[1]] == undefined ) {
                            return `referência não declarada`;
                        }
                   }
                break;
                
                case 3:
                    if ( COMMDS_3[line_raw[1]] == undefined ){return `comando inválido`;}
                    if ( !isNaN(line_raw[2])) {
                        let val = parseInt(line_raw[2]);
                       
                        if (val < 0 || val >= 128) {
                            return `valor inváldio`;
                        }
                    }else {
                          return `valor inválido`;
                    }
                    
                    if ( typeof line_raw[0] != 'string') {
                        return `um referência precisa ser em texto`;
                    }else {
                        if (SUGARS[line_raw[0]] == undefined) {
                            SUGARS[line_raw[0]] = parseInt(line_raw[2])
                        }else {
                            return `referência duplicada`;
                        }
                    } 
                    
                break;
            }
        }
       
       let reg_lv0 = /^([\w]{1,20}:)/gm
       let labels_keys = Object.keys(LABELS)
       let ouputcode = []
       
       if ( labels_keys.length > 0 && labels_keys.find( x => x == 'main') == undefined ) {
           return "Erro, labels daclarados, porém o label MAIN não foi encontrado";
       }
       
       for ( let line=0; line<raw_code.length; line++ ) {
           let line_raw = raw_code[line].split(" ")
           
           if ( line_raw.length <= 2 ) {
               if (LABELS[line_raw[1]] != undefined ) {
                   ouputcode.push(`${line_raw[0]} ${LABELS[line_raw[1]]}`)
                   continue;
               }
               if (SUGARS[line_raw[1]] != undefined) {
                   ouputcode.push(`${line_raw[0]} ${SUGARS[line_raw[1]]}`)
                   continue
               }
               if (raw_code[line].match(reg_lv0) !== null) {
                   if (raw_code[line] == 'main:') {ouputcode.push('lbm'); continue;}
                   if (raw_code[line] != 'main:') {ouputcode.push('lbl'); continue;}
               }
               ouputcode.push(raw_code[line])
           }
           else{continue}
           
       }
       
       return ouputcode;
    }
}