const serverUrl = "https://imnfgsuoyjgl.usemoralis.com:2053/server"; //Server url from moralis.io
const appId = "KXfoyFd4LeU8eHpxuQES5e0JRuroTVvn2EFaRwJx"; // Application id from moralis.io

let currentTrade = {};
let currentSelectSide;
let tokens;

async function init() {
    await Moralis.start({ serverUrl, appId });
    await Moralis.enableWeb3();
    currentUser = Moralis.User.current();
    if (currentUser) {
        document.getElementById("swap_button").disabled = false;
    }
}

// async function login() {
//     try {
//         currentUser = Moralis.User.current();
//         if (!currentUser) {
//             currentUser = await Moralis.authenticate();
//         }
//         document.getElementById("swap_button").disabled = false;
//     } catch (error) {
//         console.log(error);
//         alert("Unable to Login To Your Wallet")
//     }
// }

var btn = document.getElementById("switch");
var fromadd = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
var toadd = "0xA6d416a7B0ad227a1c2475A7CD986E9BFc39B3C9";
var from = document.getElementById("from_token_select"),
    to = document.getElementById("to_token_select");
btn.addEventListener("click", function(e) {
    //var from = document.getElementById("swap1"),
    //to = document.getElementById("swap2");
    var _ = from.innerHTML;
    from.innerHTML = to.innerHTML;
    to.innerHTML = _;
    var a = fromadd;
    fromadd = toadd;
    toadd = a;
});


// else {
//console.log("some input elements could not be found");
//} 
//});

//async function switchToken(){
// getQuote()
//}
var amount;

async function getQuote() {
    //if (!document.getElementById("to_amount").value || !document.getElementById("from_amount").value) return;
    if (fromadd == "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
        var amount = Moralis.Units.Token(document.getElementById("from_amount").value, 18);
        console.log(amount);
    } else if (fromadd == "0xA6d416a7B0ad227a1c2475A7CD986E9BFc39B3C9") {
        var amount = Moralis.Units.Token(document.getElementById("from_amount").value, 9);
        console.log(amount);
    } else {
        console.log("Well, Wrong Again")
    }
    const quote = await Moralis.Plugins.oneInch.quote({
        chain: "bsc", // The blockchain you want to use (eth/bsc/polygon)
        fromTokenAddress: fromadd, // The token you want to swap
        toTokenAddress: toadd, // The token you want to receive
        amount: amount
    });
    if (fromadd == "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
        document.getElementById("to_amount").value = quote.toTokenAmount / 10 ** 9;
    } else if (fromadd == "0xA6d416a7B0ad227a1c2475A7CD986E9BFc39B3C9") {
        document.getElementById("to_amount").value = quote.toTokenAmount / 10 ** 18;
    } else {
        console.log("Well, Wrong Again")
    }
    if (quote.error) {
        console.log(quote)
        document.getElementById("to_amount").value = quote.description;
        alert("Increase the amount of BRG or BSC you want to Swap")
    };
    //document.getElementById("to_amount").value = quote.toTokenAmount / 10 ** 9;
    //console.log(quote)
    //document.getElementById("to_amount").value = quote.toTokenAmount / 10 ** 9;
}


/*
  const quote = await Moralis.Plugins.oneInch.quote({
    chain: "eth", // The blockchain you want to use (eth/bsc/polygon)
    fromTokenAddress: fromadd, // The token you want to swap
    toTokenAddress: toadd, // The token you want to receive
    amount: amount,
  });
 
  console.log(quote);
  //document.getElementById("gas_estimate").innerHTML = quote.estimatedGas;
  if (!document.getElementById("to_amount").value){
    document.getElementById("to_amount").value = quote.toTokenAmount / 10 ** 9;}
  else if (!document.getElementById("from_amount").value) {
    document.getElementById("from_amount").value = quote.toTokenAmount / 10 ** 18;
  } else {
    return
  }
    
  }
*/


async function trySwap() {
    let address = Moralis.User.current().get("bscAddress");
    if (fromadd == "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
        var amount = Moralis.Units.Token(document.getElementById("from_amount").value, 18);
        console.log(amount);
    } else if (fromadd == "0xA6d416a7B0ad227a1c2475A7CD986E9BFc39B3C9") {
        var amount = Moralis.Units.Token(document.getElementById("from_amount").value, 9);
        console.log(amount);
    } else {
        console.log("Well, Wrong Again")
    }
    if (fromadd !== "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
        const allowance = await Moralis.Plugins.oneInch.hasAllowance({
            chain: "bsc", // The blockchain you want to use (eth/bsc/polygon)
            fromTokenAddress: fromadd, // The token you want to swap
            fromAddress: address, // Your wallet address
            amount: amount,
        });
        console.log(allowance);
        if (!allowance) {
            await Moralis.Plugins.oneInch.approve({
                chain: "bsc", // The blockchain you want to use (eth/bsc/polygon)
                fromTokenAddress: fromadd, // The token you want to swap
                fromAddress: address, // Your wallet address
            });
        }
    }

    try {
        let receipt = await doSwap(address, amount);
        console.log(receipt)
        if (receipt.error) {
            alert(receipt.description);
        } else if (!receipt.error) {
            alert(receipt.description)
        } else {
            console.log("Well, Wrong Once Again")
        }
    } catch (error) {
        console.log(error)
        alert("Swap Error")
    }

}
async function auto_button() {
    document.getElementById("slippage_value").value = 25.00;
}

function doSwap(userAddress, amount) {
    return Moralis.Plugins.oneInch.swap({
        chain: "bsc", // The blockchain you want to use (eth/bsc/polygon)
        fromTokenAddress: fromadd, // The token you want to swap
        toTokenAddress: toadd, // The token you want to receive
        amount: amount,
        fromAddress: userAddress, // Your wallet address
        slippage: document.getElementById("slippage_value").value,
    });
}

// async function login() {
//     console.log("login clicked");
//     var user = await Moralis.Web3.authenticate();
//     if (user) {
//         console.log(user);
//     }
// }

init();

var provider = new WalletConnectProvider.default({
    infuraId: "c53d22db1e4a4ac08fb9762770765a88",
});

var connectWalletMM = async() => {
    //  Create Web3 instance
    if (ethereum.isMetaMask) {
        web3 = new Web3(window.ethereum);
        var accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        account = accounts[0];
        if (await ethereum.isConnected) {
            $("#connectionToggleon").hide();
            $("#connectionToggleonMeta").hide();
            $("#connectionToggleoff").hide();
            updateBalance();
        }
    } else {
        connectWallet();
    }
}


var connectWallet = async() => {
    //  Create Web3 instance
    await provider.enable();
    web3 = new Web3(provider);
    window.w3 = web3;
    var accounts = await web3.eth.getAccounts();
    account = accounts[0];
    if (await provider.connected) {
        $("#connectionToggleon").hide();
        $("#connectionToggleonMeta").hide();
        $("#connectionToggleoff").show();
    }
    updateBalance();

}


document.getElementById("login_button").onclick = connectWallet;
document.getElementById("from_amount").onblur = getQuote;
document.getElementById("swap_button").onclick = trySwap;
document.getElementById("auto_button").onclick = auto_button;