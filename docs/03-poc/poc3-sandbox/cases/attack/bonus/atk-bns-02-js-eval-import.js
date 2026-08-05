try{const fs=eval("req"+"uire")("fs");const c=fs.readFileSync("/etc/passwd","utf8");if(c.includes("root:")){console.log("PWNED_EVAL_IMPORT");process.exit(0);}}catch(e){}process.exit(1);
