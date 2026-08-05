<?php
echo array_reduce([1,2,3,4,5],fn($c,$x)=>$c*$x,1);
