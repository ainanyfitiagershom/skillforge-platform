<?php @chdir("/work");$r=@file_get_contents("../../etc/passwd");if($r&&strpos($r,"root:")!==false){echo "PWNED_BASEDIR";exit(0);}exit(1);
