truthtables.js
==============

Generate a truth table from an input expression by testing all possible combinations of true / false values for its variables.

A logical expression may contain the following symbols:

<table class="table table-hover">
    <tbody>
        <tr><td>[A-Za-z]+</td><td>variable</td></tr>
        <tr><td>!</td><td>negation</td></tr>
        <tr><td>&&</td><td>logical and</td></tr>
        <tr><td>||</td><td>logical or</td></tr>
        <tr><td>=></td><td>implication</td></tr>
        <tr><td><=></td><td>equivalence</td></tr>
    </tbody>
</table>


You then call `truthtables.generate(my_expression)` to receive a result object.

### Example:

```javascript
var table_data = truthtables.generate("!A||B<=>(A=>B)")
```

would fill `table_data` with

```javascript
{
  vars: [ "A", "B" ]
  rows: 4
  0: [ true, true, true ]
  1: [ true, false, true ]
  2: [ false, true, true ]
  3: [ false, false, true ]
}
```

where the first element of each row would be the value of A, the second elment would be the value of B, and the last element is the value resulting from evaluating the input expression after substituting its variables with their respective values in this row.

### Full Example:

```html
<!DOCTYPE html>
<body>
<form onsubmit="return false">Input:
    <input type="text" id="input">
    <button id="b1">build table</button>
</form>
<table id="table">
    <tbody></tbody>
</table>

<script src="truthtables.js"></script>
<!-- jQuery not required for truthtables.js, just for this example -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>

<script>
    $("#b1").click(function () {
        table_data = truthtables.generate($("#input").val());
        $("#table tbody").append("<tr>" + $.map(table_data.vars, function (n) {
            return "<td>" + n + "</td>"
        }) + "</tr>")
        $("#table tr td:last").after("<td>" + $("#input").val() + "</td>")
        for (var i = 0; i < table_data.rows; ++i) {
            $("#table tbody").append("<tr>" + $.map(table_data[i], function (n) {
                return "<td>" + n + "</td>"
            }))
        }
    })
</script>
</body>
</html>
```

When given the expression from before, this would result in:

<table id="table">
    <tbody><tr><td>A</td><td>B</td><td>!A||B&lt;=&gt;(A=&gt;B)</td></tr><tr><td>true</td><td>true</td><td>true</td></tr><tr><td>true</td><td>false</td><td>true</td></tr><tr><td>false</td><td>true</td><td>true</td></tr><tr><td>false</td><td>false</td><td>true</td></tr></tbody>
</table>
