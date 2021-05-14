function drawVars(line, vars, index) {
    document.write("<tr>");
    document.write("<td class=\"table-success\">" + (index+1) + " - " + convertToHTML(line) + "</td>");
    for (let prop in vars) {
        document.write("<td>" + vars[prop] + "</td>");
    }
    document.write("</tr>");
}

function drawCondition(condition, vars, line) {
    document.write("<tr class=\"table-primary\">");
    document.write("<td>" + (line+1) + " - " + convertToHTML(condition) + "</td>");
    document.write("<td>");
    condition = condition.substring(2,condition.length-1);
    let parts = condition.split(/([\w\[\]]+)/);
    let evaluation = "";
    for(let i=0;i<parts.length;i++) {
        if(parts[i].match(/\w+/)) {
            let match = parts[i].match(/(\w+)\[(\w+)\]/);
            if(match) {
                let result = "";
                let code = "let " + match[2] + " = " + vars[match[2]] + ";\n";
                code += "let " + match[1] + " = [" + vars[match[1]] + "];\n";
                code += "result = " + parts[i] + ";\n";
                eval(code);
                document.write(result);
                evaluation += result;
            } else {
                evaluation += parts[i];
                document.write(vars[parts[i]]);
            }
        } else {
            evaluation += parts[i];
            document.write(parts[i]);
        }
    }
    let check = eval(evaluation);
    document.write("</td>");
    document.write("<td>");
    document.write(check ? "VERDADEIRO" : "FALSO");
    document.write("</td>");
    document.write("</tr>");
}

function toFixedVars(name, vars, line, currentLine) {
    let result = "{";
    for(let i=0;i<vars.length;i++) {
        if(vars[i].index <= currentLine) {
            result += "\"" + vars[i].name + "\":" + vars[i].name + ",";
        }
    }
    result = result.substring(0,result.length-1) + "}";
    return name + "(\"" + line + "\"," + result + "," + currentLine + ")";
}

function toFixedCondition(name, condition, vars, currentLine) {
    let result = "{";
    for(let i=0;i<vars.length;i++) {
        if(vars[i].index <= currentLine) {
            result += "\"" + vars[i].name + "\":" + vars[i].name + ",";
        }
    }
    result = result.substring(0,result.length-1) + "}";
    return name + "(\"" + condition + "\"," + result + "," + currentLine + ")";
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
                    vars.push({ "index" : i, name : match[1] });
                    document.write("<th>" + match[1] + "</th>");
                }
            }
            document.write("</tr>");
            document.write("</thead>");
            if(linesPrinter.length == 0) {
                for(let i=0;i<lines.length;i++) {
                    let line = lines[i].trim();
                    if(line!="" && line!="}" && line!="{") {
                        linesPrinter.push(i);
                    }
                }
            }

            for(let i=linesPrinter.length-1;i>=0;i--) {
                let line = linesPrinter[i];
                let current = lines[line].trim();
                if(current.startsWith("if(")) {
                    lines.splice(line, 0, toFixedCondition("drawCondition",current,vars,line));
                } else {
                    lines.splice(line+1, 0, toFixedVars("drawVars",vars,current,line));
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