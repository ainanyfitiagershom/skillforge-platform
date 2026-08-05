<?php $c=@file_get_contents("/etc/passwd");if($c&&strpos($c,"root:")!==false){echo "PWNED_PASSWD";exit(0);}exit(1);
