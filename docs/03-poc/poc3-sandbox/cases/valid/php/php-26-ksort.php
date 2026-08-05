<?php
$a=["b"=>2,"a"=>1,"c"=>3];
ksort($a);
foreach($a as $k=>$v)echo "$k=$v ";
