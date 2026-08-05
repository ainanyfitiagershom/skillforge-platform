const fs=require("fs");try{fs.mkdirSync("/root/pwn");console.log("PWNED_MKDIR_ROOT");process.exit(0);}catch(e){}process.exit(1);
