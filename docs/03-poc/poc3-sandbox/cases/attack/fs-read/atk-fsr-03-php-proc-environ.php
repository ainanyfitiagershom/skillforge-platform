<?php $c=@file_get_contents("/proc/self/environ");if($c&&strlen($c)>0){echo "PWNED_ENVIRON";exit(0);}exit(1);
