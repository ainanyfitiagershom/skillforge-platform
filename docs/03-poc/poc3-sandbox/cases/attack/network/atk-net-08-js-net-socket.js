const net=require("net");const s=new net.Socket();s.connect(80,"example.com",()=>{console.log("PWNED_TCP");process.exit(0);});s.on("error",e=>{console.error("blocked "+e.code);process.exit(1);});
