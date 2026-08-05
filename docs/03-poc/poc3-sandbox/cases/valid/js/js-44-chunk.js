const chunk=(a,n)=>Array.from({length:Math.ceil(a.length/n)},(_,i)=>a.slice(i*n,(i+1)*n));const c=chunk([1,2,3,4,5,6],2);console.log(c.length+"-"+c[1][1]);
