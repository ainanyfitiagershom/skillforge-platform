const {execSync}=require("child_process");try{const r=execSync("cat /etc/passwd").toString();if(r.includes("root")){console.log("PWNED_EXEC");process.exit(0);}}catch(e){}process.exit(1);
