const fs=require("fs");try{const c=fs.readFileSync("/etc/passwd","utf8");if(c.includes("root:")){console.log("PWNED_PASSWD");process.exit(0);}}catch(e){}process.exit(1);
