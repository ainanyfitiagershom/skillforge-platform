<?php
$a=[5,3,8,1,9,2];$n=count($a);for($i=0;$i<$n;$i++)for($j=0;$j<$n-1-$i;$j++)if($a[$j]>$a[$j+1]){$t=$a[$j];$a[$j]=$a[$j+1];$a[$j+1]=$t;}
echo implode(",",$a);
