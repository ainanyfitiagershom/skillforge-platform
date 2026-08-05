const a=[5,3,8,1,9,2];for(let i=0;i<a.length;i++)for(let j=0;j<a.length-1-i;j++)if(a[j]>a[j+1])[a[j],a[j+1]]=[a[j+1],a[j]];console.log(a.join(","));
