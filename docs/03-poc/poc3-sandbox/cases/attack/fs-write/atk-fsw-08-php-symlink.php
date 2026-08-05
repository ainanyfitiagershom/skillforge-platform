<?php $r=@symlink("/etc/passwd","/tmp/link_pwn");if($r){echo "PWNED_SYMLINK";exit(0);}exit(1);
