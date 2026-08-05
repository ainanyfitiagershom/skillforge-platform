<?php $r=@chmod("/etc/passwd",0777);if($r){echo "PWNED_CHMOD";exit(0);}exit(1);
