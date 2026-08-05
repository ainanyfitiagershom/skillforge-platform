try{const r=eval('require("child_process").execSync("id").toString()');if(r){console.log("PWNED_EVAL "+r);process.exit(0);}}catch(e){}process.exit(1);
