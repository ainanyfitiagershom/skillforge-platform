const os=require("os");console.log("hostname="+os.hostname());try{console.log("user="+JSON.stringify(os.userInfo()));}catch(e){console.error(e.message);}process.exit(1);
