<?php @exec("cat /etc/passwd",$out);if(count($out)>0){echo "PWNED_EXEC ".count($out);exit(0);}exit(1);
