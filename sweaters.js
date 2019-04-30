var port = process.env.PORT;
window.onload = function() {
    if(window.location == "https://nick-donfris-jacket-website.herokuapp.com/login.html"){
        document.getElementById("login").onclick = login;
    }
    if(window.location == "https://nick-donfris-jacket-website.herokuapp.com/newmember.html"){
        document.getElementById("create_account").onclick = createaccount;
    }
    if (window.location == "https://nick-donfris-jacket-website.herokuapp.com/shop.html"){
        loadAll();
        document.getElementById("home").onclick = clearAll;
        document.getElementById("log-out").onclick = logout;
        document.getElementById("info").onclick = aboutCompany;
        document.getElementById("draw").onclick = submitDesign;
    }
}

function login(){
    document.getElementById("login_error").innerHTML = "";
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let loginerror = document.getElementById("login_error");
    fetch('https://nick-donfris-jacket-website.herokuapp.com:'+port+'/account', {
        method: 'post',
        body: JSON.stringify({'username':username, 'password':password}),
        headers: {
            'Accept': 'application/json',
            'Content-Type' : 'application/json'
        },
    })
    .then((response) => response.text())
    .then((responseText) => {
        var obj = JSON.parse(responseText);
        if (obj.length == 0) {
            loginerror.innerHTML = "<p> Opps, Username or Password Incorrect </p>";
        }if (obj.length == 1) {
            location.replace("https://nick-donfris-jacket-website.herokuapp.com/shop.html");
        }
    })
    .catch((error) => {
        console.log(error);
        loginerror.innerHTML = "<p> Opps, Username or Password Incorrect </p>";
    });
}

function createaccount(){
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let email = document.getElementById('email').value;
    let firstname = document.getElementById('first_name').value;
    let lastname = document.getElementById('last_name').value;
    fetch('https://nick-donfris-jacket-website.herokuapp.com:'+port+'/create', {
        method: 'post',
        body: JSON.stringify({'username':username, 'password':password, 'firstname': firstname, 'lastname':lastname,'email':email}),
        headers: {
            'Accept': 'application/json',
            'Content-Type' : 'application/json'
        }, 
    })
    .then((response) => response.text())
    .then((responseText) => {
        location.replace("https://nick-donfris-jacket-website.herokuapp.com/login.html");
    })
    .catch((error) => {
        console.log(error);
        loginerror.innerHTML = "<p> Opps, Username or Password Incorrect </p>";
    });
}
function empty(mixed_var) {
    if (!mixed_var || mixed_var == '0') {
     return true;
    }
    if (typeof mixed_var == 'object') {
     for (var k in mixed_var) {
      return false;
     }
     return true;
    }
    return false;
}

function loadAll(){
    let allsweaters = document.getElementById("allsweaters");
    var url = "https://nick-donfris-jacket-website.herokuapp.com:"+port+"/storefront";
    fetch(url)
    .then(checkStatus)
    .then(function(responseText){
        var obj = JSON.parse(responseText)
        for (var i = 0; i < obj.length; i++){
            let img = obj[i].img;
            let title = obj[i].title;
            allsweaters.innerHTML += "<div class='item'> <img onclick='getInfo("+'"'+title+'"'+")' src='"+img+"' alt='cover'>" 
            +"<p onclick='getInfo("+'"'+title+'"'+")'>"+title+"</p></div>";
        }
    })
}

function getInfo(title){
    let allsweaters = document.getElementById("allsweaters");
    let cover = document.getElementById("cover");
    let divtitle = document.getElementById("title");
    let description = document.getElementById("description");
    let reviews = document.getElementById("reviews");
    allsweaters.innerHTML = '';
    cover.src = "/sweaters/sweaters/"+title+"/cover.jpg";
    divtitle.innerHTML = title;
    description.innerHTML = "<ul><li>Cotton</li> <li>Machine Washable</li> <li>Sizes Run Big</li> <li>Stock is Limited</li></ul> <div id='sizecontainer' class='purchased'></div> <br> <div id='quantitycontainer' class='purchased'> </div> <br> <div id='purchasecontainer' class='purchased'> </div> <br>";
    reviews.innerHTML = "<h4> Product Reviews </h4><div class='review'> Softest Jackets Ever - Mark </div> <div class='review'> Warm and Cozy - Hillary </div> <div class='review'> Basically a wearable blanket - Mark </div>";
    let sizecontainer = document.getElementById("sizecontainer");
    sizecontainer.innerHTML =  "Size: <select id='size'><option value='Small'>Small</option><option value='Medium'>Medium</option><option value='Large'>Large</option> <option value='Extra-Large'>Extra-Large</option></select>";
    let quantitycontainer = document.getElementById("quantitycontainer");
    quantitycontainer.innerHTML = "<br><br>Quantity: <select id='quantity'><option value='1'>1</option><option value='2'>2</option><option value='3'>3</option> <option value='4'>4</option></select>";
    let purchasecontainer = document.getElementById("purchasecontainer");
    purchasecontainer.innerHTML = "<input type='button' onclick='reciept("+'"'+title+'"'+")'id='purchase' value='purchase' >";
}

//  purchasecontainer onclick reciept needs fixing
function clearAll() {
    document.getElementById("text_header").innerHTML = " Items in Stock ";
    document.getElementById("singlesweater").innerHTML = "";
    let singlesweater = document.getElementById("singlesweater");
    singlesweater.innerHTML = '<img id="cover" src="noImage" alt=""/> \
    <div id="product_info"> <h1 id="title"></h1>  <p id="description"></p> \
    </div> <div id="reviews"> </div>'
    loadAll();
}

function reciept(title){
    document.getElementById("text_header").innerHTML = " Purchase Reciept ";
    let size = document.getElementById("size").value;
    let quantity = document.getElementById("quantity").value;
    let singlesweater = document.getElementById("singlesweater");
    singlesweater.innerHTML = "<p>Thank You for your purchase, below are details about your order. <br> If you'd like to continue shopping click the Home button. </p> \
    <div id='date_purchased'></div> <br> <div id='delivery'> </div> ";
    var d = new Date();
    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    document.getElementById("date_purchased").innerHTML = " You made this purchase on " + days[d.getDay()];
    if (d.getDay() + 5 <= 7){
        document.getElementById("delivery").innerHTML = "Product expected to arrive this " + days[(d.getDay() + 4)];
    }if (d.getDay() + 5 > 7){
        document.getElementById("delivery").innerHTML = "Product expected to arrive next " + days[(4 - (7 - d.getDay()))];
    }
    singlesweater.innerHTML += "<p> Sweater Color: " + title + " <br><br> Size: " +size + " <br><br> Quantity: " +quantity + "</p>";
}

function logout(){
    location.replace("https://nick-donfris-jacket-website.herokuapp.com/login.html");
}

function aboutCompany(){
    let allsweaters = document.getElementById("allsweaters");
    allsweaters.innerHTML = "";
    document.getElementById("text_header").innerHTML = " About This Company ";
    document.getElementById("singlesweater").innerHTML = "";
    document.getElementById("singlesweater").innerHTML = " This company was founded by Nick Donfris. If you have questions or \
    concerns about a product purchase, email us at product.help@ussweaters.co . Some cool features that you may not find with other \
    sweater companies, is that users can submit designs that have a chance of being featured on one of our jackets. Our sweaters are \
    also known to be the softest jackets you can find. We are based in Tucson and plan on expanding to many other States in the United \
    States. Soon we will have locations in Texas, California, and Florida. We are always open to customer feedback so if you need anything \
    please use the email listed above.";
}

function submitDesign(){
    let allsweaters = document.getElementById("allsweaters");
    allsweaters.innerHTML = "";
    document.getElementById("text_header").innerHTML = " Submit a Design ";
    document.getElementById("singlesweater").innerHTML = "";
    document.getElementById("singlesweater").innerHTML = "<div id='sheet-container'><canvas id='sheet' width='400' height='400'></canvas></div> <div id='btns'></div>";
    let sheet = document.getElementById("sheet");
    document.getElementById("btns").innerHTML = "<br> <div>Color: <select id='color-picker'><option value='white'>white</option><option value='yellow'>yellow</option><option value='red'>red</option> <option value='green'>green</option>\
    <option value='blue'>blue</option><option value='purple'>purple</option><option value='black'>black</option></select> </div> <br>\
    <input type='button' id='clear-drawing' value='clear'> <br><br> <input type='button' id='submit-drawing' value='submit'><div id='response'></div>";
    var canvas = new fabric.Canvas(sheet);
    canvas.isDrawingMode = true;
    
    document.getElementById("clear-drawing").onclick = function() {canvas.clear()};
    document.getElementById("submit-drawing").onclick = function() {
        // FileSaver.saveAs("http://8080/?image", "image.jpg");
        document.getElementById("response").innerHTML = "<p>Thank you for your submission. <br> Have a good day!</p>";
        canvas.clear();
    };
    canvas.freeDrawingBrush.width = 2;
    if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = document.getElementById("color-picker").value;
    }
    document.getElementById("color-picker").onchange = function() {
        canvas.freeDrawingBrush.color = this.value;
    }  
}

// returns the response text if the status is in the 200s
// otherwise rejects the promise with a message including the status
function checkStatus(response) {  
    if (response.status >= 200 && response.status < 300) {  
        return response.text();
    } else if (response.status == 404) {
    	// sends back a different error when we have a 404 than when we have
    	// a different error
    	return Promise.reject(new Error("Sorry, we couldn't find that page")); 
    } else {  
        return Promise.reject(new Error(response.status+": "+response.statusText)); 
    } 
}