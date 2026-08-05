<?php $r=@file_get_contents("http://example.com");if($r){echo "PWNED_NETWORK";exit(0);} echo "blocked";exit(1);
