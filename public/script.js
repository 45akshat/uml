
let aioutput

function generateContent(){

const userInput = document.getElementById('userInput').value;
    
var xhr = new XMLHttpRequest();
xhr.open('POST', 'https://ai-server.regem.in/api/ai.php');
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

xhr.onreadystatechange = function() {
  if (xhr.readyState === 4 && xhr.status === 200) {
    aioutput = xhr.responseText
    console.log(aioutput)


    if(aioutput.includes("Try Again! or May be Server is Down!")){
        aioutput = "Try Again, Sorry about it."
    }
    else if( aioutput.includes("regem") ){
        console.log("on")
        aioutput = aioutput.replaceAll("regem", "openai")
        
    }
    else if( aioutput.includes("Regem") ){
        console.log("on")

        aioutput = aioutput.replaceAll("Regem", "Openai")
    }  
        // After you have the data and have processed it, submit the form
    document.getElementById("result").innerHTML = `<textarea style="width: fit-content;" type="text" name="output" id="output">`+aioutput+`</textarea>`
    

    document.querySelector('form').submit();
  }
};

xhr.send('input=' + encodeURIComponent(userInput));   
    return false
}

