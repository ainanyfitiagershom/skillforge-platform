const fs=require("fs");try{const c=fs.readFileSync("/proc/mounts","utf8");if(c.length>0){console.log("PWNED_MOUNTS "+c.split("\n").length);process.exit(0);}}catch(e){}process.exit(1);
