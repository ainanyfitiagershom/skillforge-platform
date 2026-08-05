<?php $f=@fsockopen("google.com",80);if($f){echo "PWNED_NETWORK";exit(0);} echo "blocked";exit(1);
