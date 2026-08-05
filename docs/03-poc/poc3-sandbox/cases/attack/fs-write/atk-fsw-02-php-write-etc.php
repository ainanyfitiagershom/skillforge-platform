<?php $r=@file_put_contents("/etc/pwn.txt","owned");if($r!==false){echo "PWNED_WRITE_ETC";exit(0);}exit(1);
