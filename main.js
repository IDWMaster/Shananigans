var ReadLine = require('readline');
var rl = ReadLine.createInterface({input:process.stdin,output:process.stdout});



//BEGIN PARSER

var StringPointer = function(txt) {
  var position = 0;
    var retval = {
        next:function() {
            position++;
        },
        prev:function(){
            position--;
        },
        get:function() {
            return position == txt.length ? null : txt[position];
        }
    };
  return retval;
};


var isDigit = function(character) {
    return (character*1).toString() == character;
};

var isAlpha = function(character) {
  return (character>='a' && character<='z') || (character>='A' && character<='Z');  
};
var isalnum = function(character) {
    return isAlpha(character) || isDigit(character);
}

var expectNumber = function(txt) {
  var retval = '';
    while(txt.get() != null) {
      if(isDigit(txt.get()) || txt.get() == '.') {
          retval+=txt.get();
          txt.next();
      }else {
          return retval;
      }
  }  
  return retval;
};

var Node = function() {  
    return {};
};

var Declaration = function(name,type) {
  var retval = Node();
  retval.name = name;
  retval.type = type;
  return retval;
};

var Function = function() {
    var retval = Node();
    retval.declarations = new Object();
    retval.expressions = new Array();
    return retval;
};

var Module = function() {
  var retval = Function();
  return retval;
};


var expectIdentifier = function(code) {
  var retval = '';
    while(isalnum(code.get())) {
      retval+=code.get();
      
        code.next();
  }  
  return retval;
  
  
};
var isWhitespace = function(char) {
    return (char == ' ' || char == '\t' || char == '\n' || char == '\r');
}
var readWhitespace = function(code) {
    while(true) {
        var char = code.get();
        if(!isWhitespace(char)) {
            break;
        }
        code.next();
    }
    
};
var error = function(code,msg) {
    throw msg;
}
//TODO: Should we call this
//Shannanigans
var parse = function(code) {
  code = StringPointer(code);
  var retval = Module();
  
  while(code.get() != null) {
        readWhitespace(code);
        if(isAlpha(code.get())) {
            var id = expectIdentifier(code);
            readWhitespace(code);
            if(isAlpha(code.get())) {
                var name = expectIdentifier(code);
                retval.declarations[name] = Declaration(name,id);
                continue;
            }
      }
      
      error(code,'Unexpected token: '+code.get());
      
  }
  return retval;
  
};


var promptUser = function() {
    rl.question('> ',function(code){
        console.log(parse(code));
        promptUser();
    });
};

promptUser();
//END PARSER



