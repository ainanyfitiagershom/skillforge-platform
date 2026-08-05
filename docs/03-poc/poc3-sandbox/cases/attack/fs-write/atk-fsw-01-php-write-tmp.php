<?php $r=@file_put_contents("/tmp/pwn.txt","owned");if($r!==false){echo "PWNED_WRITE_TMP";exit(0);}exit(1);
