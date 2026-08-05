<?php
echo implode(",",array_map(fn($x)=>$x*$x,[1,2,3,4,5]));
