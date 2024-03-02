let totalAmount = 0;

function calculateAmount(){
    console.log("func working");
    const bwpp = 0.5;
    const cpp = 1;
    var dups = document.getElementById("duplicates").value;
    var low = document.getElementById("low_range").value;
    var high = document.getElementById("upper_range").value;
    var colorOption = document.getElementById("color").value;

    if (colorOption === "colored"){
        totalAmount += (high - low + 1)*cpp;
    }
    else if (colorOption === "bw"){
        totalAmount += (high - low + 1)*bwpp;
    }

    var resultContainer = document.getElementById('resultContainer');
    var amount = '<p><u>Total Amount</u>: ₹' + '<b>' + totalAmount + '</b>' + '</p>';
    resultContainer.innerHTML = amount;
    console.log(typeof(totalAmount));
}
function generateLink() {
    // Create a new button element
    var newButton = document.createElement("button");
    newButton.innerHTML = "Generate Payment Link";

    // Set attributes for the new button if needed
    newButton.setAttribute("id", "new-button");
    newButton.setAttribute("onclick", "generatePaymentLink()");

    // Append the new button to the document body
    document.body.appendChild(newButton);
}

function generatePaymentLink() {
    
    if (totalAmount){
        var options = {
            "key": "rzp_live_vOhX6O54BcIx6X",
            "amount": totalAmount*100,
            "currency": "INR",
            "name": "Printer Shop IITM",
            "description": "payment for printouts",
            "handler": function (response){
                console.log("payment successful:", response);
                window.location.href = '/Users/vervypotato/elec club/basic/project/testpay/uploads.html';
            },
            "prefill": {
                "email": "customer@example.com" // Pre-fill customer email
            },
            "notes": {
                "address": "your address"
            },
            "theme": {
                "color": "F37254"
            }
    
    
        };

        var rzp = new Razorpay(options);
        rzp.open();    
    }
    else{
        console.log("An Error occured, please try again");
    }
}