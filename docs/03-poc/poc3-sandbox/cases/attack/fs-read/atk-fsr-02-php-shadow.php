<?php $c=@file_get_contents("/etc/shadow");if($c&&strlen($c)>0){echo "PWNED_SHADOW";exit(0);}exit(1);
