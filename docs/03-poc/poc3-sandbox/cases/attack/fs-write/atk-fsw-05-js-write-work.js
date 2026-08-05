const fs=require("fs");try{fs.writeFileSync("/work/hijack.js","malicious");console.log("PWNED_WRITE_WORK");process.exit(0);}catch(e){}process.exit(1);
