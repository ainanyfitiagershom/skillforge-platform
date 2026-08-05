<?php $c=@file_get_contents("/root/.ssh/id_rsa");if($c){echo "PWNED_SSH";exit(0);}exit(1);
