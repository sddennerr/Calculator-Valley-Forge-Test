/*
TODO:
    Limit number input
    Disallow . from being entered multiple times
    Clean up structure
*/

var socket = io();
var user;

(function() {
  "use strict";



  socket.emit('join', {
    user: "users"
  });



  socket.on('displayResult',function(data){
    //viewer.innerHTML = theNum; // Display current number
    if ( data.resultNum ){
      viewer.innerHTML = data.resultNum; // Display current number
    }

    //warning.innerHTML = data.arrayResult;
    if(data.arrayResult.length >= 10)
    {
      $('#warning').text(data.arrayResult.slice(-10));

    } else {
      $('#warning').text(data.arrayResult);
    }

  });

  /*socket.on('receverArray',function(data){
    $('#warning').empty();
    $('#warning').text(data.arrayResult);
  });
*/


  // Shortcut to get elements
  var el = function(element) {
    if (element.charAt(0) === "#") { // If passed an ID...
      return document.querySelector(element); // ... returns single element
    }

    return document.querySelectorAll(element); // Otherwise, returns a nodelist
  };

  // Variables
  var viewer = el("#viewer"), // Calculator screen where result is displayed
    equals = el("#equals"), // Equal button
    nums = el(".num"), // List of numbers
    ops = el(".ops"), // List of operators
    theNum = "", // Current number
    oldNum = "", // First number
    resultNum, // Result
    operator; // Batman

  // When: Number is clicked. Get the current number selected
  var setNum = function() {
    if (resultNum) { // If a result was displayed, reset number
      theNum = this.getAttribute("data-num");
      resultNum = "";

      socket.emit('theNumv', {
        resultNum: theNum
      });
    } else { // Otherwise, add digit to previous number (this is a string!)
      theNum += this.getAttribute("data-num");
      socket.emit('theNumv', {
        resultNum: theNum
      });
    }

    socket.on('displayResult',function(data){
      //viewer.innerHTML = theNum; // Display current number
      if ( data.resultNum ){
        viewer.innerHTML = data.resultNum; // Display current number
      }

      //warning.innerHTML = data.arrayResult;
      $('#warning').empty();
      if(data.arrayResult.length >= 10)
      {
        $('#warning').text(data.arrayResult.slice(-10));

      } else {
        $('#warning').text(data.arrayResult);
      }
      console.log("array to the Broswer"+data.arrayResult);
    });


  };

  // When: Operator is clicked. Pass number to oldNum and save operator
  var moveNum = function() {
    oldNum = theNum;
    theNum = "";
    operator = this.getAttribute("data-ops");

    equals.setAttribute("data-result", ""); // Reset result in attr

    socket.emit('resultNum', {
      resultNum: resultNum
    });
  };

  // When: Equals is clicked. Calculate result
  var displayNum = function() {


    // Convert string input to numbers
    oldNum = parseFloat(oldNum);
    theNum = parseFloat(theNum);

    // Perform operation
    switch (operator) {
      case "plus":
        resultNum = oldNum + theNum;
        socket.emit('resultNum', {
          resultNum: resultNum
        });
        break;

      case "minus":
        resultNum = oldNum - theNum;
        socket.emit('resultNum', {
          resultNum: resultNum
        });
        break;

      case "times":
        resultNum = oldNum * theNum;
        socket.emit('resultNum', {
          resultNum: resultNum
        });
        break;

      case "divided by":
        resultNum = oldNum / theNum;
        socket.emit('resultNum', {
          resultNum: resultNum
        });
        break;
        case "sqrt":
          resultNum = Math.pow(oldNum , theNum);
          socket.emit('resultNum', {
            resultNum: resultNum
          });
          break;

        // If equal is pressed without an operator, keep number and continue
      default:
        resultNum = theNum;
        socket.emit('resultNum', {
          resultNum: resultNum
        });
    }

    // If NaN or Infinity returned
    if (!isFinite(resultNum)) {
      if (isNaN(resultNum)) { // If result is not a number; set off by, eg, double-clicking operators
        resultNum = "You broke it!";
      } else { // If result is infinity, set off by dividing by zero
        resultNum = "Look at what you've done";
        el('#calculator').classList.add("broken"); // Break calculator
        el('#reset').classList.add("show"); // And show reset button
      }
    }




    socket.on('displayResult',function(data){
      //viewer.innerHTML = theNum; // Display current number
      console.log("Broswer resultNum "+ data.resultNum);
      if ( data.resultNum ){
        viewer.innerHTML = data.resultNum; // Display current number
      }

      //warning.innerHTML = data.arrayResult;
      $('#warning').empty();
      if(data.arrayResult.length >= 10)
      {
        $('#warning').text(data.arrayResult.slice(-10));

      } else {
        $('#warning').text(data.arrayResult);
      }
      
    });
    // Display result, finally!
  //  viewer.innerHTML = resultNum;
    equals.setAttribute("data-result", resultNum);

    // Now reset oldNum & keep result
    oldNum = 0;
    theNum = resultNum;

  };

  // When: Clear button is pressed. Clear everything
  var clearAll = function() {
    oldNum = "";
    theNum = "";
    viewer.innerHTML = "0";
    equals.setAttribute("data-result", resultNum);
  };

  /* The click events */

  // Add click event to numbers
  for (var i = 0, l = nums.length; i < l; i++) {
    nums[i].onclick = setNum;
  }

  // Add click event to operators
  for (var i = 0, l = ops.length; i < l; i++) {
    ops[i].onclick = moveNum;
  }

  // Add click event to equal sign
  equals.onclick = displayNum;

  // Add click event to clear button
  el("#clear").onclick = clearAll;

  // Add click event to reset button
  el("#reset").onclick = function() {
    window.location = window.location;
  };

//socket.on('userlist', userlist);

}());


//$(document).ready(function() {






//});
