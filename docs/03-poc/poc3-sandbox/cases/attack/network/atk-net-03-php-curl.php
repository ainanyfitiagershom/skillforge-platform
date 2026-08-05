<?php if(!function_exists("curl_init")){exit(1);}$c=curl_init("http://example.com");curl_setopt($c,CURLOPT_RETURNTRANSFER,1);$r=@curl_exec($c);if($r){echo "PWNED_NETWORK";exit(0);}exit(1);
