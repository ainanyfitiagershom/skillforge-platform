require("dns").lookup("google.com",(err,addr)=>{if(!err&&addr){console.log("PWNED_DNS "+addr);process.exit(0);}else{console.error("blocked");process.exit(1);}});
