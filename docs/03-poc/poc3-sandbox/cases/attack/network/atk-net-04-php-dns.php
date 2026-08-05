<?php $ip=gethostbyname("google.com");if($ip!=="google.com" && filter_var($ip,FILTER_VALIDATE_IP)){echo "PWNED_DNS ".$ip;exit(0);}exit(1);
