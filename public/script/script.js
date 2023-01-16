const update = document.querySelector(".updates");

const input = document.getElementById("exampleInputPassword1");

update.innerHTML = "";

input.addEventListener("keyup", ()=> {
    const inputValue = input.value;
    if(inputValue.length == 0) {
        update.innerHTML = "";
    }
    else if(inputValue.length < 8) {
        update.innerHTML = "Length is low!";
        update.style.color = "#ff0000";
    }
    else {
        update.innerHTML = "Good";
        update.style.color = "#00ff0d";
    }
})



