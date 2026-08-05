<?php
$x=10;$f=function($y)use($x){return $x+$y;};
echo $f(5);
