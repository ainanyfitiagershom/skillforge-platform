#!/usr/bin/env node
// Génère les 150 cas du POC 3 (100 valides + 50 attaques) + manifest.json.
// Chaque cas = { id, language, category, verdict, description, codeFile, testsFile? }
// verdict = "PASS" (exit 0, tests passent) | "BLOCKED" (exit != 0 OU TIMEOUT OU OOM OU SECURITY_VIOLATION)

import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const CASES = join(ROOT, 'cases');

const manifest = [];

function writeCase({ id, language, category, verdict, description, code, tests }) {
  const subdir = category === 'VALID' ? `valid/${language.toLowerCase()}` : `attack/${category}`;
  const ext = language === 'PHP' ? 'php' : 'js';
  const codeFile = `${subdir}/${id}.${ext}`;
  mkdirSync(join(CASES, subdir), { recursive: true });
  writeFileSync(join(CASES, codeFile), code);
  let testsFile;
  if (tests) {
    const testsExt = language === 'PHP' ? 'php' : 'test.js';
    testsFile = `${subdir}/${id}.tests.${testsExt}`;
    writeFileSync(join(CASES, testsFile), tests);
  }
  manifest.push({ id, language, category, verdict, description, codeFile, testsFile });
}

// =========================================================================
// 50 CAS VALIDES PHP
// =========================================================================
const validPhp = [
  { id: 'php-01-fizzbuzz', desc: 'FizzBuzz de 1 a 15', code: `<?php\nfor(\$i=1;\$i<=15;\$i++){if(\$i%15==0)echo"FizzBuzz\\n";elseif(\$i%3==0)echo"Fizz\\n";elseif(\$i%5==0)echo"Buzz\\n";else echo\$i."\\n";}\n` },
  { id: 'php-02-factorielle', desc: 'Factorielle recursive de 6', code: `<?php\nfunction f(\$n){return \$n<=1?1:\$n*f(\$n-1);}\necho f(6);\n` },
  { id: 'php-03-fibonacci', desc: '10 premiers Fibonacci', code: `<?php\n\$a=0;\$b=1;for(\$i=0;\$i<10;\$i++){echo \$a." ";\$c=\$a+\$b;\$a=\$b;\$b=\$c;}\n` },
  { id: 'php-04-reverse-string', desc: 'Renverser une chaine', code: `<?php\necho strrev("SkillForge");\n` },
  { id: 'php-05-palindrome', desc: 'Test palindrome', code: `<?php\nfunction p(\$s){return \$s===strrev(\$s);}\nvar_export(p("radar"));\n` },
  { id: 'php-06-tri-bulles', desc: 'Tri a bulles', code: `<?php\n\$a=[5,3,8,1,9,2];\$n=count(\$a);for(\$i=0;\$i<\$n;\$i++)for(\$j=0;\$j<\$n-1-\$i;\$j++)if(\$a[\$j]>\$a[\$j+1]){\$t=\$a[\$j];\$a[\$j]=\$a[\$j+1];\$a[\$j+1]=\$t;}\necho implode(",",\$a);\n` },
  { id: 'php-07-somme-tableau', desc: 'Somme array_sum', code: `<?php\necho array_sum([1,2,3,4,5,6,7,8,9,10]);\n` },
  { id: 'php-08-json-encode', desc: 'JSON encode array associatif', code: `<?php\necho json_encode(["nom"=>"Fitia","age"=>25,"tags"=>["php","java"]]);\n` },
  { id: 'php-09-json-decode', desc: 'JSON decode et acces cle', code: `<?php\n\$d=json_decode('{"a":1,"b":[2,3]}',true);\necho \$d["b"][1];\n` },
  { id: 'php-10-regex-email', desc: 'Validation email regex', code: `<?php\nvar_export((bool)preg_match('/^[\\w.+-]+@[\\w-]+\\.[a-z]{2,}$/i',"a@b.co"));\n` },
  { id: 'php-11-str-replace', desc: 'Remplacement multiple', code: `<?php\necho str_replace(["a","e"],["4","3"],"salut les amis");\n` },
  { id: 'php-12-explode-implode', desc: 'Split puis join', code: `<?php\necho implode("-",array_reverse(explode(" ","le chat noir")));\n` },
  { id: 'php-13-array-filter', desc: 'Filtrer pairs', code: `<?php\necho implode(",",array_filter([1,2,3,4,5,6],fn(\$x)=>\$x%2==0));\n` },
  { id: 'php-14-array-map', desc: 'Map carre', code: `<?php\necho implode(",",array_map(fn(\$x)=>\$x*\$x,[1,2,3,4,5]));\n` },
  { id: 'php-15-array-reduce', desc: 'Reduce produit', code: `<?php\necho array_reduce([1,2,3,4,5],fn(\$c,\$x)=>\$c*\$x,1);\n` },
  { id: 'php-16-count-words', desc: 'Compter mots str_word_count', code: `<?php\necho str_word_count("le renard brun saute sur le chien paresseux");\n` },
  { id: 'php-17-uppercase', desc: 'strtoupper', code: `<?php\necho strtoupper("SkillForge Platform");\n` },
  { id: 'php-18-substring', desc: 'substr avec offset negatif', code: `<?php\necho substr("SkillForge",-5);\n` },
  { id: 'php-19-date-format', desc: 'Formater date fixe', code: `<?php\necho date("Y-m-d",1704067200);\n` },
  { id: 'php-20-sprintf', desc: 'sprintf multi args', code: `<?php\necho sprintf("[%03d] %s - %.2f%%",7,"OK",93.456);\n` },
  { id: 'php-21-closures', desc: 'Closure use', code: `<?php\n\$x=10;\$f=function(\$y)use(\$x){return \$x+\$y;};\necho \$f(5);\n` },
  { id: 'php-22-array-slice', desc: 'array_slice', code: `<?php\necho implode(",",array_slice([1,2,3,4,5,6,7],2,3));\n` },
  { id: 'php-23-array-merge', desc: 'Merge tableaux', code: `<?php\necho implode(",",array_merge([1,2,3],[4,5,6]));\n` },
  { id: 'php-24-array-unique', desc: 'array_unique', code: `<?php\necho implode(",",array_values(array_unique([1,2,2,3,3,3,4])));\n` },
  { id: 'php-25-sort-desc', desc: 'rsort tri decroissant', code: `<?php\n\$a=[3,1,4,1,5,9,2,6];\nrsort(\$a);\necho implode(",",\$a);\n` },
  { id: 'php-26-ksort', desc: 'ksort tri par cle', code: `<?php\n\$a=["b"=>2,"a"=>1,"c"=>3];\nksort(\$a);\nforeach(\$a as \$k=>\$v)echo "\$k=\$v ";\n` },
  { id: 'php-27-in-array', desc: 'in_array', code: `<?php\nvar_export(in_array("php",["java","php","go"]));\n` },
  { id: 'php-28-array-search', desc: 'array_search index', code: `<?php\necho array_search("b",["a","b","c","d"]);\n` },
  { id: 'php-29-max-min', desc: 'max et min', code: `<?php\necho max(3,7,1,9,4)."-".min(3,7,1,9,4);\n` },
  { id: 'php-30-round-floor', desc: 'round floor ceil', code: `<?php\necho round(3.567,1)."-".floor(3.9)."-".ceil(3.1);\n` },
  { id: 'php-31-abs-pow', desc: 'abs et pow', code: `<?php\necho abs(-42)."-".pow(2,10);\n` },
  { id: 'php-32-strpos', desc: 'strpos', code: `<?php\necho strpos("developpeur","lop");\n` },
  { id: 'php-33-str-pad', desc: 'str_pad', code: `<?php\necho str_pad("42",5,"0",STR_PAD_LEFT);\n` },
  { id: 'php-34-str-repeat', desc: 'str_repeat', code: `<?php\necho str_repeat("=-",5);\n` },
  { id: 'php-35-trim', desc: 'trim spaces', code: `<?php\necho "[".trim("   hello   ")."]";\n` },
  { id: 'php-36-array-keys', desc: 'array_keys', code: `<?php\necho implode(",",array_keys(["a"=>1,"b"=>2,"c"=>3]));\n` },
  { id: 'php-37-array-values', desc: 'array_values', code: `<?php\necho implode(",",array_values(["a"=>1,"b"=>2,"c"=>3]));\n` },
  { id: 'php-38-array-flip', desc: 'array_flip', code: `<?php\n\$f=array_flip(["a","b","c"]);\necho \$f["b"];\n` },
  { id: 'php-39-count-recursive', desc: 'count recursive', code: `<?php\necho count([1,[2,3],[4,[5,6]]],COUNT_RECURSIVE);\n` },
  { id: 'php-40-array-column', desc: 'array_column', code: `<?php\n\$r=[["id"=>1,"n"=>"a"],["id"=>2,"n"=>"b"],["id"=>3,"n"=>"c"]];\necho implode(",",array_column(\$r,"n"));\n` },
  { id: 'php-41-array-combine', desc: 'array_combine', code: `<?php\n\$c=array_combine(["a","b","c"],[1,2,3]);\necho \$c["b"];\n` },
  { id: 'php-42-range', desc: 'range', code: `<?php\necho implode(",",range(1,5));\n` },
  { id: 'php-43-array-fill', desc: 'array_fill', code: `<?php\necho implode(",",array_fill(0,4,"x"));\n` },
  { id: 'php-44-array-chunk', desc: 'array_chunk', code: `<?php\n\$c=array_chunk([1,2,3,4,5,6],2);\necho count(\$c)."-".\$c[1][1];\n` },
  { id: 'php-45-array-reverse', desc: 'array_reverse', code: `<?php\necho implode(",",array_reverse([1,2,3,4,5]));\n` },
  { id: 'php-46-array-sum-int', desc: 'array_sum entiers', code: `<?php\necho array_sum(range(1,100));\n` },
  { id: 'php-47-array-product', desc: 'array_product', code: `<?php\necho array_product([1,2,3,4,5,6]);\n` },
  { id: 'php-48-string-split', desc: 'str_split', code: `<?php\necho implode("-",str_split("abcdef",2));\n` },
  { id: 'php-49-numeric-check', desc: 'is_numeric', code: `<?php\nvar_export(is_numeric("3.14"));echo"\\n";var_export(is_numeric("abc"));\n` },
  { id: 'php-50-associative-loop', desc: 'foreach associatif', code: `<?php\n\$u=["nom"=>"Fitia","ecole"=>"MBDS","annee"=>2026];\nforeach(\$u as \$k=>\$v)echo "\$k:\$v\\n";\n` },
];

for (const c of validPhp) {
  writeCase({ id: c.id, language: 'PHP', category: 'VALID', verdict: 'PASS', description: c.desc, code: c.code });
}

// =========================================================================
// 50 CAS VALIDES JAVASCRIPT
// =========================================================================
const validJs = [
  { id: 'js-01-fizzbuzz', desc: 'FizzBuzz 1 a 15', code: `for(let i=1;i<=15;i++){if(i%15===0)console.log("FizzBuzz");else if(i%3===0)console.log("Fizz");else if(i%5===0)console.log("Buzz");else console.log(i);}\n` },
  { id: 'js-02-factorielle', desc: 'Factorielle recursive', code: `const f=n=>n<=1?1:n*f(n-1);console.log(f(6));\n` },
  { id: 'js-03-fibonacci', desc: '10 Fibonacci', code: `let [a,b]=[0,1];for(let i=0;i<10;i++){process.stdout.write(a+" ");[a,b]=[b,a+b];}console.log();\n` },
  { id: 'js-04-reverse-string', desc: 'Reverse string', code: `console.log("SkillForge".split("").reverse().join(""));\n` },
  { id: 'js-05-palindrome', desc: 'Palindrome', code: `const p=s=>s===s.split("").reverse().join("");console.log(p("radar"));\n` },
  { id: 'js-06-tri-bulles', desc: 'Bubble sort', code: `const a=[5,3,8,1,9,2];for(let i=0;i<a.length;i++)for(let j=0;j<a.length-1-i;j++)if(a[j]>a[j+1])[a[j],a[j+1]]=[a[j+1],a[j]];console.log(a.join(","));\n` },
  { id: 'js-07-somme-array', desc: 'Somme reduce', code: `console.log([1,2,3,4,5,6,7,8,9,10].reduce((a,b)=>a+b,0));\n` },
  { id: 'js-08-json-stringify', desc: 'JSON stringify', code: `console.log(JSON.stringify({nom:"Fitia",age:25,tags:["js","java"]}));\n` },
  { id: 'js-09-json-parse', desc: 'JSON parse', code: `const d=JSON.parse('{"a":1,"b":[2,3]}');console.log(d.b[1]);\n` },
  { id: 'js-10-regex-email', desc: 'Regex email', code: `console.log(/^[\\w.+-]+@[\\w-]+\\.[a-z]{2,}$/i.test("a@b.co"));\n` },
  { id: 'js-11-replace-all', desc: 'replaceAll', code: `console.log("salut les amis".replace(/a/g,"4").replace(/e/g,"3"));\n` },
  { id: 'js-12-split-reverse', desc: 'split reverse join', code: `console.log("le chat noir".split(" ").reverse().join("-"));\n` },
  { id: 'js-13-filter-even', desc: 'filter pairs', code: `console.log([1,2,3,4,5,6].filter(x=>x%2===0).join(","));\n` },
  { id: 'js-14-map-square', desc: 'map carre', code: `console.log([1,2,3,4,5].map(x=>x*x).join(","));\n` },
  { id: 'js-15-reduce-product', desc: 'reduce produit', code: `console.log([1,2,3,4,5].reduce((c,x)=>c*x,1));\n` },
  { id: 'js-16-count-words', desc: 'split space count', code: `console.log("le renard brun saute sur le chien paresseux".split(/\\s+/).length);\n` },
  { id: 'js-17-uppercase', desc: 'toUpperCase', code: `console.log("SkillForge Platform".toUpperCase());\n` },
  { id: 'js-18-substring', desc: 'slice negatif', code: `console.log("SkillForge".slice(-5));\n` },
  { id: 'js-19-date-format', desc: 'toISOString', code: `console.log(new Date(1704067200000).toISOString().slice(0,10));\n` },
  { id: 'js-20-template', desc: 'template string', code: `const [n,s,v]=[7,"OK",93.456];console.log(\`[\${String(n).padStart(3,"0")}] \${s} - \${v.toFixed(2)}%\`);\n` },
  { id: 'js-21-closure', desc: 'Closure counter', code: `const mk=()=>{let n=0;return()=>++n;};const c=mk();c();c();c();console.log(c());\n` },
  { id: 'js-22-slice', desc: 'Array slice', code: `console.log([1,2,3,4,5,6,7].slice(2,5).join(","));\n` },
  { id: 'js-23-concat-spread', desc: 'Spread concat', code: `console.log([...[1,2,3],...[4,5,6]].join(","));\n` },
  { id: 'js-24-unique-set', desc: 'Set unique', code: `console.log([...new Set([1,2,2,3,3,3,4])].join(","));\n` },
  { id: 'js-25-sort-desc', desc: 'sort desc', code: `console.log([3,1,4,1,5,9,2,6].sort((a,b)=>b-a).join(","));\n` },
  { id: 'js-26-object-keys', desc: 'Object.keys sorted', code: `const o={b:2,a:1,c:3};console.log(Object.keys(o).sort().map(k=>\`\${k}=\${o[k]}\`).join(" "));\n` },
  { id: 'js-27-includes', desc: 'Array includes', code: `console.log(["java","js","go"].includes("js"));\n` },
  { id: 'js-28-index-of', desc: 'indexOf', code: `console.log(["a","b","c","d"].indexOf("b"));\n` },
  { id: 'js-29-max-min', desc: 'Math max min', code: `console.log(Math.max(3,7,1,9,4)+"-"+Math.min(3,7,1,9,4));\n` },
  { id: 'js-30-round-floor', desc: 'Math round floor ceil', code: `console.log(Math.round(3.567*10)/10+"-"+Math.floor(3.9)+"-"+Math.ceil(3.1));\n` },
  { id: 'js-31-abs-pow', desc: 'Math abs pow', code: `console.log(Math.abs(-42)+"-"+Math.pow(2,10));\n` },
  { id: 'js-32-index-substring', desc: 'indexOf substring', code: `console.log("developpeur".indexOf("lop"));\n` },
  { id: 'js-33-padstart', desc: 'padStart', code: `console.log("42".padStart(5,"0"));\n` },
  { id: 'js-34-repeat', desc: 'String repeat', code: `console.log("=-".repeat(5));\n` },
  { id: 'js-35-trim', desc: 'trim', code: `console.log("["+"   hello   ".trim()+"]");\n` },
  { id: 'js-36-object-keys-simple', desc: 'Object.keys', code: `console.log(Object.keys({a:1,b:2,c:3}).join(","));\n` },
  { id: 'js-37-object-values', desc: 'Object.values', code: `console.log(Object.values({a:1,b:2,c:3}).join(","));\n` },
  { id: 'js-38-object-entries-flip', desc: 'entries flip', code: `const src=["a","b","c"];const o=Object.fromEntries(src.map((v,i)=>[v,i]));console.log(o.b);\n` },
  { id: 'js-39-flat-recursive', desc: 'flat Infinity count', code: `const a=[1,[2,3],[4,[5,6]]];console.log(a.flat(Infinity).length);\n` },
  { id: 'js-40-map-column', desc: 'map column', code: `const r=[{id:1,n:"a"},{id:2,n:"b"},{id:3,n:"c"}];console.log(r.map(x=>x.n).join(","));\n` },
  { id: 'js-41-object-fromentries', desc: 'Object.fromEntries', code: `const c=Object.fromEntries(["a","b","c"].map((k,i)=>[k,i+1]));console.log(c.b);\n` },
  { id: 'js-42-range', desc: 'Array from range', code: `console.log(Array.from({length:5},(_,i)=>i+1).join(","));\n` },
  { id: 'js-43-array-fill', desc: 'Array fill', code: `console.log(new Array(4).fill("x").join(","));\n` },
  { id: 'js-44-chunk', desc: 'chunk manuel', code: `const chunk=(a,n)=>Array.from({length:Math.ceil(a.length/n)},(_,i)=>a.slice(i*n,(i+1)*n));const c=chunk([1,2,3,4,5,6],2);console.log(c.length+"-"+c[1][1]);\n` },
  { id: 'js-45-reverse', desc: 'Array reverse', code: `console.log([1,2,3,4,5].reverse().join(","));\n` },
  { id: 'js-46-sum-range', desc: 'Somme 1 a 100', code: `console.log(Array.from({length:100},(_,i)=>i+1).reduce((a,b)=>a+b,0));\n` },
  { id: 'js-47-product', desc: 'Produit reduce', code: `console.log([1,2,3,4,5,6].reduce((a,b)=>a*b,1));\n` },
  { id: 'js-48-string-split-n', desc: 'match par 2', code: `console.log("abcdef".match(/.{1,2}/g).join("-"));\n` },
  { id: 'js-49-numeric-check', desc: 'Number isNaN', code: `console.log(!isNaN(Number("3.14")));console.log(!isNaN(Number("abc")));\n` },
  { id: 'js-50-object-loop', desc: 'for-in object', code: `const u={nom:"Fitia",ecole:"MBDS",annee:2026};for(const k in u)console.log(\`\${k}:\${u[k]}\`);\n` },
];

for (const c of validJs) {
  writeCase({ id: c.id, language: 'JS', category: 'VALID', verdict: 'PASS', description: c.desc, code: c.code });
}

// =========================================================================
// 50 CAS D'ATTAQUE — 6 categories x 8 cas + 2 bonus
// verdict attendu = "BLOCKED" (exit non zero OU TIMEOUT OU OOM)
// =========================================================================

const attacks = [
  // --- CATEGORY: fork-dos (8 cas) : fork bomb, boucles infinies, CPU DoS ---
  { id: 'atk-fork-01-php-while-true', language: 'PHP', category: 'fork-dos', desc: 'Boucle infinie PHP', code: `<?php while(true){}\n` },
  { id: 'atk-fork-02-php-recursion', language: 'PHP', category: 'fork-dos', desc: 'Recursion infinie stack overflow', code: `<?php function r(){r();} r();\n` },
  { id: 'atk-fork-03-js-while-true', language: 'JS', category: 'fork-dos', desc: 'Boucle infinie JS', code: `while(true){}\n` },
  { id: 'atk-fork-04-js-recursion', language: 'JS', category: 'fork-dos', desc: 'Recursion infinie JS', code: `function r(){r();} r();\n` },
  { id: 'atk-fork-05-php-fork-bomb', language: 'PHP', category: 'fork-dos', desc: 'Fork bomb via pcntl_fork', code: `<?php while(true){ if(function_exists('pcntl_fork')) pcntl_fork(); }\n` },
  { id: 'atk-fork-06-js-child-process', language: 'JS', category: 'fork-dos', desc: 'child_process.fork bomb', code: `const {fork}=require("child_process");while(true){try{fork(__filename);}catch(e){}}\n` },
  { id: 'atk-fork-07-js-setinterval', language: 'JS', category: 'fork-dos', desc: 'setInterval qui spawn', code: `const {spawn}=require("child_process");setInterval(()=>{try{spawn("node",[__filename]);}catch(e){}},0);\n` },
  { id: 'atk-fork-08-php-usleep-loop', language: 'PHP', category: 'fork-dos', desc: 'Boucle avec usleep pour eviter idle detect', code: `<?php while(true){usleep(1000);}\n` },

  // --- CATEGORY: network (8 cas) : tentatives de sortie reseau ---
  { id: 'atk-net-01-php-fsockopen', language: 'PHP', category: 'network', desc: 'fsockopen vers Google', code: `<?php \$f=@fsockopen("google.com",80);if(\$f){echo "PWNED_NETWORK";exit(0);} echo "blocked";exit(1);\n` },
  { id: 'atk-net-02-php-file-get-http', language: 'PHP', category: 'network', desc: 'file_get_contents http', code: `<?php \$r=@file_get_contents("http://example.com");if(\$r){echo "PWNED_NETWORK";exit(0);} echo "blocked";exit(1);\n` },
  { id: 'atk-net-03-php-curl', language: 'PHP', category: 'network', desc: 'curl_exec vers domaine externe', code: `<?php if(!function_exists("curl_init")){exit(1);}\$c=curl_init("http://example.com");curl_setopt(\$c,CURLOPT_RETURNTRANSFER,1);\$r=@curl_exec(\$c);if(\$r){echo "PWNED_NETWORK";exit(0);}exit(1);\n` },
  { id: 'atk-net-04-php-dns', language: 'PHP', category: 'network', desc: 'DNS lookup gethostbyname', code: `<?php \$ip=gethostbyname("google.com");if(\$ip!=="google.com" && filter_var(\$ip,FILTER_VALIDATE_IP)){echo "PWNED_DNS ".\$ip;exit(0);}exit(1);\n` },
  { id: 'atk-net-05-js-http-get', language: 'JS', category: 'network', desc: 'http.get vers Google', code: `const http=require("http");http.get("http://example.com",r=>{console.log("PWNED_NETWORK "+r.statusCode);process.exit(0);}).on("error",e=>{console.error("blocked "+e.code);process.exit(1);});setTimeout(()=>{console.error("timeout");process.exit(1);},4000);\n` },
  { id: 'atk-net-06-js-https-get', language: 'JS', category: 'network', desc: 'https.get vers domaine externe', code: `const https=require("https");https.get("https://example.com",r=>{console.log("PWNED_HTTPS "+r.statusCode);process.exit(0);}).on("error",e=>{console.error("blocked "+e.code);process.exit(1);});setTimeout(()=>{console.error("timeout");process.exit(1);},4000);\n` },
  { id: 'atk-net-07-js-dns-lookup', language: 'JS', category: 'network', desc: 'dns.lookup', code: `require("dns").lookup("google.com",(err,addr)=>{if(!err&&addr){console.log("PWNED_DNS "+addr);process.exit(0);}else{console.error("blocked");process.exit(1);}});\n` },
  { id: 'atk-net-08-js-net-socket', language: 'JS', category: 'network', desc: 'net.Socket TCP brut', code: `const net=require("net");const s=new net.Socket();s.connect(80,"example.com",()=>{console.log("PWNED_TCP");process.exit(0);});s.on("error",e=>{console.error("blocked "+e.code);process.exit(1);});\n` },

  // --- CATEGORY: fs-read (8 cas) : lecture fichiers systeme ---
  { id: 'atk-fsr-01-php-passwd', language: 'PHP', category: 'fs-read', desc: 'Lecture /etc/passwd', code: `<?php \$c=@file_get_contents("/etc/passwd");if(\$c&&strpos(\$c,"root:")!==false){echo "PWNED_PASSWD";exit(0);}exit(1);\n` },
  { id: 'atk-fsr-02-php-shadow', language: 'PHP', category: 'fs-read', desc: 'Lecture /etc/shadow (protege)', code: `<?php \$c=@file_get_contents("/etc/shadow");if(\$c&&strlen(\$c)>0){echo "PWNED_SHADOW";exit(0);}exit(1);\n` },
  { id: 'atk-fsr-03-php-proc-environ', language: 'PHP', category: 'fs-read', desc: 'Lecture /proc/self/environ', code: `<?php \$c=@file_get_contents("/proc/self/environ");if(\$c&&strlen(\$c)>0){echo "PWNED_ENVIRON";exit(0);}exit(1);\n` },
  { id: 'atk-fsr-04-php-ssh-key', language: 'PHP', category: 'fs-read', desc: 'Lecture .ssh/id_rsa root', code: `<?php \$c=@file_get_contents("/root/.ssh/id_rsa");if(\$c){echo "PWNED_SSH";exit(0);}exit(1);\n` },
  { id: 'atk-fsr-05-js-passwd', language: 'JS', category: 'fs-read', desc: 'JS lit /etc/passwd', code: `const fs=require("fs");try{const c=fs.readFileSync("/etc/passwd","utf8");if(c.includes("root:")){console.log("PWNED_PASSWD");process.exit(0);}}catch(e){}process.exit(1);\n` },
  { id: 'atk-fsr-06-js-proc-mounts', language: 'JS', category: 'fs-read', desc: 'JS lit /proc/mounts', code: `const fs=require("fs");try{const c=fs.readFileSync("/proc/mounts","utf8");if(c.length>0){console.log("PWNED_MOUNTS "+c.split("\\n").length);process.exit(0);}}catch(e){}process.exit(1);\n` },
  { id: 'atk-fsr-07-php-listdir-host', language: 'PHP', category: 'fs-read', desc: 'Listing / racine host', code: `<?php \$s=@scandir("/");\$h=["bin","boot","etc","home","root"];\$hit=0;foreach(\$h as \$d)if(in_array(\$d,\$s??[]))\$hit++;if(\$hit>=3){echo "PWNED_LIST_ROOT ".\$hit;exit(0);}exit(1);\n` },
  { id: 'atk-fsr-08-js-hostname', language: 'JS', category: 'fs-read', desc: 'os.hostname os.userInfo', code: `const os=require("os");console.log("hostname="+os.hostname());try{console.log("user="+JSON.stringify(os.userInfo()));}catch(e){console.error(e.message);}process.exit(1);\n` },

  // --- CATEGORY: fs-write (8 cas) : ecriture / persistance ---
  { id: 'atk-fsw-01-php-write-tmp', language: 'PHP', category: 'fs-write', desc: 'Ecriture dans /tmp', code: `<?php \$r=@file_put_contents("/tmp/pwn.txt","owned");if(\$r!==false){echo "PWNED_WRITE_TMP";exit(0);}exit(1);\n` },
  { id: 'atk-fsw-02-php-write-etc', language: 'PHP', category: 'fs-write', desc: 'Ecriture dans /etc (readonly)', code: `<?php \$r=@file_put_contents("/etc/pwn.txt","owned");if(\$r!==false){echo "PWNED_WRITE_ETC";exit(0);}exit(1);\n` },
  { id: 'atk-fsw-03-php-chmod', language: 'PHP', category: 'fs-write', desc: 'chmod fichier systeme', code: `<?php \$r=@chmod("/etc/passwd",0777);if(\$r){echo "PWNED_CHMOD";exit(0);}exit(1);\n` },
  { id: 'atk-fsw-04-js-write-tmp', language: 'JS', category: 'fs-write', desc: 'JS write /tmp', code: `const fs=require("fs");try{fs.writeFileSync("/tmp/pwn.txt","owned");console.log("PWNED_WRITE_TMP");process.exit(0);}catch(e){}process.exit(1);\n` },
  { id: 'atk-fsw-05-js-write-work', language: 'JS', category: 'fs-write', desc: 'Reecrire /work (mount readonly)', code: `const fs=require("fs");try{fs.writeFileSync("/work/hijack.js","malicious");console.log("PWNED_WRITE_WORK");process.exit(0);}catch(e){}process.exit(1);\n` },
  { id: 'atk-fsw-06-php-mkdir-root', language: 'PHP', category: 'fs-write', desc: 'mkdir dans /', code: `<?php \$r=@mkdir("/pwn");if(\$r){echo "PWNED_MKDIR_ROOT";exit(0);}exit(1);\n` },
  { id: 'atk-fsw-07-js-mkdir-host', language: 'JS', category: 'fs-write', desc: 'mkdir /root', code: `const fs=require("fs");try{fs.mkdirSync("/root/pwn");console.log("PWNED_MKDIR_ROOT");process.exit(0);}catch(e){}process.exit(1);\n` },
  { id: 'atk-fsw-08-php-symlink', language: 'PHP', category: 'fs-write', desc: 'Symlink /etc/passwd', code: `<?php \$r=@symlink("/etc/passwd","/tmp/link_pwn");if(\$r){echo "PWNED_SYMLINK";exit(0);}exit(1);\n` },

  // --- CATEGORY: memory (8 cas) : depassement memoire ---
  { id: 'atk-mem-01-php-string', language: 'PHP', category: 'memory', desc: 'Alloc string 512 Mo', code: `<?php ini_set("memory_limit","-1");\$s=str_repeat("a",512*1024*1024);echo strlen(\$s);\n` },
  { id: 'atk-mem-02-php-array-grow', language: 'PHP', category: 'memory', desc: 'Array 10M entrees', code: `<?php ini_set("memory_limit","-1");\$a=[];for(\$i=0;\$i<10000000;\$i++)\$a[]=str_repeat("x",100);echo count(\$a);\n` },
  { id: 'atk-mem-03-php-recurse-string', language: 'PHP', category: 'memory', desc: 'String doubling', code: `<?php ini_set("memory_limit","-1");\$s="a";for(\$i=0;\$i<32;\$i++)\$s.=\$s;echo strlen(\$s);\n` },
  { id: 'atk-mem-04-js-buffer', language: 'JS', category: 'memory', desc: 'Buffer 512 Mo (force RSS via fill)', code: `const b=Buffer.alloc(512*1024*1024);b.fill(1);console.log(b.length);\n` },
  { id: 'atk-mem-05-js-array-grow', language: 'JS', category: 'memory', desc: 'Array push 10M objets', code: `const a=[];for(let i=0;i<10000000;i++)a.push({i,x:"a".repeat(100)});console.log(a.length);\n` },
  { id: 'atk-mem-06-js-string-double', language: 'JS', category: 'memory', desc: 'String doubling JS', code: `let s="a";for(let i=0;i<32;i++)s+=s;console.log(s.length);\n` },
  { id: 'atk-mem-07-php-fill-arr', language: 'PHP', category: 'memory', desc: 'array_fill enorme', code: `<?php ini_set("memory_limit","-1");\$a=array_fill(0,100000000,"xxxxxxxxxx");echo count(\$a);\n` },
  { id: 'atk-mem-08-js-typed-array', language: 'JS', category: 'memory', desc: 'Float64Array 512 Mo (avec ecriture)', code: `const a=new Float64Array(64*1024*1024);for(let i=0;i<a.length;i++)a[i]=i;console.log(a.length);\n` },

  // --- CATEGORY: escape (8 cas) : escape process / execution shell ---
  { id: 'atk-esc-01-php-shell-exec', language: 'PHP', category: 'escape', desc: 'shell_exec id', code: `<?php \$r=@shell_exec("id");if(\$r){echo "PWNED_SHELL ".\$r;exit(0);}exit(1);\n` },
  { id: 'atk-esc-02-php-system', language: 'PHP', category: 'escape', desc: 'system() ls', code: `<?php \$r=@system("ls /");if(\$r!==false){echo "PWNED_SYSTEM";exit(0);}exit(1);\n` },
  { id: 'atk-esc-03-php-exec', language: 'PHP', category: 'escape', desc: 'exec() cat passwd', code: `<?php @exec("cat /etc/passwd",\$out);if(count(\$out)>0){echo "PWNED_EXEC ".count(\$out);exit(0);}exit(1);\n` },
  { id: 'atk-esc-04-php-backticks', language: 'PHP', category: 'escape', desc: 'Backticks whoami', code: `<?php \$r=@\`whoami\`;if(\$r){echo "PWNED_BACKTICKS ".\$r;exit(0);}exit(1);\n` },
  { id: 'atk-esc-05-js-child-exec', language: 'JS', category: 'escape', desc: 'child_process.exec', code: `const {execSync}=require("child_process");try{const r=execSync("cat /etc/passwd").toString();if(r.includes("root")){console.log("PWNED_EXEC");process.exit(0);}}catch(e){}process.exit(1);\n` },
  { id: 'atk-esc-06-js-spawn', language: 'JS', category: 'escape', desc: 'spawn ls /', code: `const {spawnSync}=require("child_process");const r=spawnSync("ls",["/"],{encoding:"utf8"});if(r.stdout&&r.stdout.length>0){console.log("PWNED_SPAWN "+r.stdout.split("\\n").length);process.exit(0);}process.exit(1);\n` },
  { id: 'atk-esc-07-js-eval', language: 'JS', category: 'escape', desc: 'eval require child_process', code: `try{const r=eval('require("child_process").execSync("id").toString()');if(r){console.log("PWNED_EVAL "+r);process.exit(0);}}catch(e){}process.exit(1);\n` },
  { id: 'atk-esc-08-php-eval', language: 'PHP', category: 'escape', desc: 'eval() code shell', code: `<?php @eval("\\\$r=@shell_exec('id');echo \\\$r?'PWNED_EVAL '.\\\$r:'blocked';");exit(1);\n` },

  // --- CATEGORY: bonus (2 cas creatifs "reels") ---
  // NOTE : version 1 avait 2 cas retires car faux positifs :
  //   - env leak sur GPG_KEYS (variable Alpine publique, pas un secret)
  //   - bind localhost:9229 (n'evade pas --network=none, reste local au conteneur)
  // Remplaces par 2 cas plus pertinents :
  { id: 'atk-bns-01-php-open-basedir', language: 'PHP', category: 'bonus', desc: 'Contourner open_basedir via chdir puis ..', code: `<?php @chdir("/work");\$r=@file_get_contents("../../etc/passwd");if(\$r&&strpos(\$r,"root:")!==false){echo "PWNED_BASEDIR";exit(0);}exit(1);\n` },
  { id: 'atk-bns-02-js-eval-import', language: 'JS', category: 'bonus', desc: 'Import dynamique fs via eval string', code: `try{const fs=eval("req"+"uire")("fs");const c=fs.readFileSync("/etc/passwd","utf8");if(c.includes("root:")){console.log("PWNED_EVAL_IMPORT");process.exit(0);}}catch(e){}process.exit(1);\n` },
];

for (const a of attacks) {
  writeCase({ id: a.id, language: a.language, category: a.category, verdict: 'BLOCKED', description: a.desc, code: a.code });
}

// =========================================================================
// MANIFEST FINAL
// =========================================================================
manifest.sort((a, b) => a.id.localeCompare(b.id));
writeFileSync(join(CASES, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Genere ${manifest.length} cas :`);
console.log(`  - VALID  : ${manifest.filter(m => m.category === 'VALID').length}`);
console.log(`  - ATTACK : ${manifest.filter(m => m.category !== 'VALID').length}`);
