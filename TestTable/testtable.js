function drawVars(line, vars, index, forVar = null) {
    document.write("<tr>");
    document.write("<td class=\"table-success\">" + (index+1) + " - " + convertToHTML(line) + "</td>");
    for (let prop in vars) {
        if(vars[prop] === "?undefined?") {
            continue;
        }
        document.write("<td>" + vars[prop] + "</td>");
    }
    if(forVar != null) {
        document.write("<td>" + forVar + "</td>");
    }
    document.write("</tr>");
}

function drawFor(vars, assign, condition, line, addDeclare = "") {
    let value = null;
    let result = false;
    let code = "";
    for(var variable in vars) {
        if(vars[variable] === "?undefined?") {
            continue;
        }
        code += "let " + variable + " = " + toJSVar(vars[variable]) + "\n";
    }
    code += assign + addDeclare + "\nresult = " + condition;
    eval(code);
    drawVars(assign, vars, line, value);
    drawIf(condition, vars, line, "table-secondary", assign);
}

function drawStartFor(vars, assign, condition, line) {
    drawFor(vars, assign, condition, line, "\nvalue = " + assign.substring(4,assign.indexOf("=")));
}

function drawIf(condition, vars, line, color="table-primary", forVar = "") {
    document.write("<tr class=\"" + color + "\">");
    document.write("<td>" + (line+1) + " - " + convertToHTML(condition) + "</td>");
    document.write("<td>");
    if(condition.startsWith("if(")) {
        condition = condition.substring(2,condition.length-1);   
    }
    let parts = condition.split(/([\w\[\]\.]+)/);
    let code = "";
    for(var variable in vars) {
        if(vars[variable] === "?undefined?") {
            continue;
        }
        code += "let " + variable + " = " + toJSVar(vars[variable]) + "\n";
    }
    code += "\n" + forVar;
    for(let i=0;i<parts.length;i++) {
        if(parts[i].match(/[\w\.]+/)) {
            let result = "";
            eval(code + "\nresult = " + parts[i] + ";");
            document.write(result);
        } else {
            document.write(parts[i]);
        }
    }
    let check = null;
    eval(code + "\ncheck =" + condition);
    document.write("</td>");
    document.write("<td>");
    document.write(check ? "VERDADEIRO" : "FALSO");
    document.write("</td>");
    document.write("</tr>");
}

function toFixedFor(name, vars, line, currentLine) {
    line = line.substring(3,line.length-1).trim();
    line = line.substring(1,line.length);
    let pieces = line.split(";");

    let result = getResultVars(vars, currentLine)

    let parts = [
        toFixedForCondition("drawStartFor", result, pieces[0], pieces[1], currentLine.start),
        toFixedForCondition("drawFor", result, pieces[2].substring(0,pieces[2].length-1), pieces[1], currentLine.end)
    ]
    return parts;
}

function getResultVars(vars, currentLine) {
    let result = "{";
    for(let i=0;i<vars.length;i++) {
        result += "\"" + vars[i].name + "\":typeof " + vars[i].name + " === \"undefined\" ? \"?undefined?\" : " + vars[i].name + " ,";
    }
    result = result.substring(0,result.length-1) + "}";
    return result;
}

function toFixedForCondition(name, result, assign, condition, currentLine) {
    return name + "(" + result + ",\"" + assign + "\",\"" + condition + "\"," + currentLine + ")"; 
}

function toFixedVars(name, vars, line, currentLine) {
    let result = getResultVars(vars, currentLine)
    return name + "(\"" + line + "\"," + result + "," + currentLine + ")";
}

function toFixedIf(name, condition, vars, currentLine) {
    let result = getResultVars(vars, currentLine)
    return name + "(\"" + condition + "\"," + result + "," + currentLine + ")";
}


function toJSVar(value)
{
  if(typeof value === "string") {
    return "\"" + value + "\"";
  } else if(value instanceof Array) {
    return "[" + value + "]";
  } else {
    
    return value;
  }
}

function convertToHTML(str)
{
  str = str.replace(/&/g, "&amp;");
  str = str.replace(/>/g, "&gt;");
  str = str.replace(/</g, "&lt;");
  str = str.replace(/"/g, "&quot;");
  str = str.replace(/'/g, "&#039;");
  return str;
}

function getURLContent(theUrl, linesPrinter = [])
{
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            let lines = xmlhttp.responseText.split("\n");
            let vars = [];
            document.write("<table class=\"table table-bordered\">");
            document.write("<thead>");
            document.write("<tr>");
            document.write("<th>linha</th>");
            for(let i=0;i<lines.length;i++) {
                let match = lines[i].match(/let\s+(\w+)/);
                if(match != null) {
                    let exists = false;
                    for(let j=0;j<vars.length;j++) {
                        if(vars[j].name == match[1]) {
                            exists = true;
                            break;
                        }
                    }
                    if(!exists) {
                        vars.push({ "index" : i, name : match[1] });
                        document.write("<th>" + match[1] + "</th>");
                    }
                }
            }
            document.write("</tr>");
            document.write("</thead>");
            if(linesPrinter.length == 0) {
                let stack = [];
                try {
                    for(let i=0;i<lines.length;i++) {
                        let line = lines[i].trim();
                        if(line.startsWith("/*")) {
                          while(!lines[i++].trim().endsWith("*/")) {
                          }  
                          i--;
                        } else if(line!="" && line!="//") {
                            if(line != "}") {
                                if(line.startsWith("if(")) {
                                    stack.push({"start": i});
                                    linesPrinter.push(stack[stack.length-1]);
                                } else if(line.startsWith("for(")) {
                                    stack.push({"start": i});
                                    linesPrinter.push(stack[stack.length-1]);
                                }else {
                                    linesPrinter.push({"start": i});
                                }
                            } else {
                                stack[stack.length-1].end = i;
                                stack.pop();
                            }
                        }
                    }
                } catch(ex) {
                    alert("Código não está nos padrões exigidos!");
                }
            }

            let lineInsertion = [];
            for(let i=0;i<=lines.length;i++) {
                lineInsertion.push({before:[],after:[]});
            }
            for(let i=0;i<linesPrinter.length;i++) {
                let line = linesPrinter[i];
                let current = lines[line.start].trim();
                if(current.startsWith("if(")) {
                    lineInsertion[line.start].before.push(toFixedIf("drawIf",current,vars,line.start));
                } else if(current.startsWith("for(")) {
                    let parts = toFixedFor("drawFor",vars,current,line);
                    lineInsertion[line.start].before.push(parts[0]);
                    if(typeof lineInsertion[line.end] === 'undefined') {
                        lineInsertion[line.end] = {before:[],after:[]};
                    }
                    lineInsertion[line.end-1].after.push(parts[1]);
                }else {
                    lineInsertion[line.start].after.push(toFixedVars("drawVars",vars,current,line.start));
                }
            }
            console.log(lineInsertion);
            for(let i=lineInsertion.length-1;i>=0;i--) {
                if(typeof lineInsertion[i] === "undefined") {
                    continue;
                }
                for(let j=0;j<lineInsertion[i].after.length;j++) {
                    lines.splice(i+1,0,lineInsertion[i].after[j]);
                }
                for(let j=0;j<lineInsertion[i].before.length;j++) {
                    lines.splice(i,0,lineInsertion[i].before[j]);
                }
            }
            let code = lines.join("\n");
            console.log(code);
            eval(code);
            document.write("</table>");
        }
    }
    xmlhttp.open("GET", theUrl, false );
    xmlhttp.send();
}