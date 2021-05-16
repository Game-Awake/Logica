function drawVars(line, vars, index, variable = null, value = null, forLine = "") {
    document.write("<tr>");
    document.write("<td class=\"table-success\">" + (index) + " - " + drawLine(forLine,line) + "</td>");
    for(let i=0;i<vars.length;i++) {
        let prop = vars[i].name;
        if(variable == prop) {
            document.write("<td>" + toJSVar(value) + "</td>");
        } else {
            document.write("<td>" + toJSVar(vars[i].value) + "</td>");
        }
    }
    document.write("</tr>");
}

function drawWhile(whileLine, vars, line) {
    drawIf(whileLine, vars, line, "table-secondary")
}

function drawFor(vars, forLine, assign, condition, line, variable = "") {
    let awake_2423423 = null;
    let code = "";
    for(let i=0;i<vars.length;i++) {
        code += "let " + vars[i].name + " = " + toJSVar(vars[i].value) + "\n";
    }
    if(variable == "") {
        variable = assign.match(/\w+/) + "";
    }
    code += assign + "\nawake_2423423 = " + variable;
    eval(code);
    drawVars(assign, vars, line, variable, awake_2423423, forLine);
    drawIf(condition, vars, line, "table-secondary", assign, forLine);
}

function drawStartFor(vars, forLine, assign, condition, line) {
    let variable = assign.substring(4,assign.indexOf("=")).trim();
    drawFor(vars, forLine, assign, condition, line, variable);
}

function drawIf(condition, vars, line, color="table-primary", forVar = "", forLine = "") {
    document.write("<tr class=\"" + color + "\">");
    document.write("<td>" + (line+1) + " - " + drawLine(forLine,condition) + "</td>");
    document.write("<td>");
    if(condition.startsWith("if(")) {
        condition = condition.substring(2,condition.length-1);   
    }
    let parts = condition.split(/([\w\[\]\.]+)/);
    let code = "";
    for(let i=0;i<vars.length;i++) {
        code += "let " + vars[i].name + " = " + toJSVar(vars[i].value) + "\n";
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

function toFixedWhile(vars, line, currentLine) {
    let whileLine = line;
    line = line.substring(5,line.length-1).trim();

    return toFixedIf("drawWhile",line, vars, currentLine);
}

function toFixedFor(vars, line, currentLine) {
    let forLine = line;
    line = line.substring(3,line.length-1).trim();
    line = line.substring(1,line.length);
    let pieces = line.split(";");

    let result = getResultVars(vars, currentLine.start, 0)
    let result2 = getResultVars(vars, currentLine.end);

    let parts = [
        toFixedForCondition("drawStartFor", result, forLine, pieces[0], pieces[1], currentLine.start),
        toFixedForCondition("drawFor", result2, forLine, pieces[2].substring(0,pieces[2].length-1), pieces[1], currentLine.start)
    ]
    return parts;
}

function getResultVars(vars, currentLine, append = 1) {
    let result = "awake_vars12 = []\ntry {\n";
    for(let i=0;i<vars.length;i++) {
        if(vars[i].index < currentLine + append) {
            result += "awake_vars12.push({\"name\":\"" + vars[i].name + "\",\"value\":" + vars[i].name + "});\n";
            //result += "\"" + vars[i].name + "\":(typeof " + vars[i].name + " === \"undefined\") ? \"?undefined?\" : " + vars[i].name + " ,";
        }
    }
    return result + "} catch {\n}\n";
}

function toFixedForCondition(name, result, forLine, assign, condition, currentLine) {
    return result + name + "(awake_vars12,\"" + formatString(forLine) + "\",\"" + assign + "\",\"" + condition + "\"," + currentLine + ");"; 
}

function toFixedVars(name, vars, line, currentLine) {
    let result = getResultVars(vars, currentLine)
    return result + name + "(\"" + formatString(line) + "\",awake_vars12," + currentLine + ");";
}

function toFixedIf(name, condition, vars, currentLine) {
    let result = getResultVars(vars, currentLine)
    return result + name + "(\"" + formatString(condition) + "\",awake_vars12," + currentLine + ");";
}

function toJSVar(value)
{
    if(typeof value === "string") {
        return "\"" + value + "\"";
    } else if(value instanceof Array || typeof value === 'object') {
        return JSON.stringify(value);
    } else {
        return value;
    }
}

function formatString(text) {
    if(typeof text === "string") {
        return text.replaceAll("\\","\\\\").replaceAll("\"","\\\"").replaceAll("\n","\\n");
    }
    return text;
}

function drawLine(forLine, line)
{
    line = convertToHTML(line);
    if(forLine != "") {
        forLine = convertToHTML(forLine);
        line = forLine.replace(line,"<span style=\"color:#0000FF;\">"+line+"</span>");
    }
    return line;
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
                let match = lines[i].match(/(let)\s+(\w+)/);
                if(match == null) {
                    match = lines[i].match(/(const)\s+(\w+)/);
                }
                if(match == null) {
                    match = lines[i].match(/(var)\s+(\w+)/);
                }
                if(match != null) {
                    let exists = false;
                    for(let j=0;j<vars.length;j++) {
                        if(vars[j].name == match[2]) {
                            exists = true;
                            break;
                        }
                    }
                    if(!exists) { 
                        vars.push({ "index" : i, type : match[1], name : match[2] });
                        document.write("<th>" + match[2] + "</th>");
                    }
                }
            }
            document.write("</tr>");
            document.write("</thead>");
            if(linesPrinter.length == 0) {
                let stack = [];
                let i=0;
                let currentLine = 0;
                try {
                    for(let i=0;i<lines.length;i++) {
                        let line = lines[i].trim();
                        if(line.startsWith("/*")) {
                          while(!lines[i++].trim().endsWith("*/")) {
                            currentLine++;
                          }  
                          i--;
                        } else if(line!="" && !line.startsWith("//")) {
                            if(line.startsWith("}")) {
                                stack[stack.length-1].end = i;
                                stack.pop();
                                if(line.match(/}\s*else\s*\{/)) {
                                    stack.push({"start": i});
                                    linesPrinter.push(stack[stack.length-1]);
                                } else if(line.match(/while\s*/)) {
                                    linesPrinter.push({"start": i});
                                }
                                currentLine++;
                            } else {
                                if(line.match(/if\s*/)) {
                                    stack.push({"start": i});
                                    linesPrinter.push(stack[stack.length-1]);
                                    currentLine++;
                                } else if(line.startsWith("let ") || line.startsWith("const ") || line.startsWith("var ")) {
                                    let count = 0;
                                    let newLine = "";
                                    let start = i;
                                    do {
                                        newLine += lines[i] + "\n";
                                        for(let c = 0; c < line.length; c++) {
                                            if(line[c] == "{" || line[c] == "[" || line[c] == "(") {
                                                count++;
                                            }
                                            if(line[c] == "}" || line[c] == "]" || line[c] == ")") {
                                                count--;
                                            }
                                        }
                                        i++;
                                        if(lines.length == i) {
                                            break;
                                        }
                                        line = lines[i].trim();
                                        currentLine++;                                       
                                    } while(count != 0);
                                    lines.splice(start,i - start,newLine);
                                    i = start;
                                    linesPrinter.push({"start": i});
                                } else if(line.match(/for\s*/)) {
                                    stack.push({"start": i});
                                    linesPrinter.push(stack[stack.length-1]);
                                    currentLine++;
                                } else if(line.match(/while\s*/)) {
                                    stack.push({"start": i});
                                    linesPrinter.push(stack[stack.length-1]);
                                    currentLine++;
                                } else if(line.match(/do\s*\{/)) {
                                    stack.push({"start": i});
                                    linesPrinter.push(stack[stack.length-1]);
                                    currentLine++;
                                } else if(line.match(/function\s*/)) {
                                    stack.push({"start": i});
                                    linesPrinter.push(stack[stack.length-1]);
                                    currentLine++;
                                } else {
                                    linesPrinter.push({"start": i});
                                    currentLine++;
                                }
                            }
                        } else {
                            currentLine++;
                        }
                    }
                } catch(ex) {
                    let oldLines = xmlhttp.responseText.split("\n");
                    alert("Código não está nos padrões exigidos na linha - " + currentLine + " - " + oldLines[currentLine] + "!");
                    alert(ex);
                }
            }

            let lineInsertion = [];
            for(let i=0;i<=lines.length;i++) {
                lineInsertion.push({before:[],after:[]});
            }
            for(let i=0;i<linesPrinter.length;i++) {
                let line = linesPrinter[i];
                let current = lines[line.start].trim();
                if(current.match(/if\s*/)) {
                    lineInsertion[line.start].before.push(toFixedIf("drawIf",current,vars,line.start));
                } else if(current.match(/}\s*while\s*/)) {
                    let newLine = toFixedWhile(vars,current.substring(1,current.length).trim(),line.start);
                    lineInsertion[line.start].before.push(newLine);
                } else if(current.match(/while\s*/)) {
                    let newLine = toFixedWhile(vars,current,line.start);
                    lineInsertion[line.start].before.push(newLine);
                    if(typeof lineInsertion[line.end-1] === 'undefined') {
                        lineInsertion[line.end-1] = {before:[],after:[]};
                    }
                    lineInsertion[line.end-1].after.push(newLine);
                } else if(current.match(/for\s*/)) {
                    let parts = toFixedFor(vars,current,line);
                    lineInsertion[line.start].before.push(parts[0]);
                    if(typeof lineInsertion[line.end-1] === 'undefined') {
                        lineInsertion[line.end-1] = {before:[],after:[]};
                    }
                    lineInsertion[line.end-1].after.push(parts[1]);
                }else {
                    lineInsertion[line.start].after.push(toFixedVars("drawVars",vars,current,line.start));
                }
            }
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
            eval(code);
            document.write("</table>");
        }
    }
    xmlhttp.open("GET", theUrl, false );
    xmlhttp.send();
}