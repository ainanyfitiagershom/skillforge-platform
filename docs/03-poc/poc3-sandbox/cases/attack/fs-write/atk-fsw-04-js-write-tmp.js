const fs=require("fs");try{fs.writeFileSync("/tmp/pwn.txt","owned");console.log("PWNED_WRITE_TMP");process.exit(0);}catch(e){}process.exit(1);
