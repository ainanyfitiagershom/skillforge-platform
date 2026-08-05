<?php $s=@scandir("/");$h=["bin","boot","etc","home","root"];$hit=0;foreach($h as $d)if(in_array($d,$s??[]))$hit++;if($hit>=3){echo "PWNED_LIST_ROOT ".$hit;exit(0);}exit(1);
