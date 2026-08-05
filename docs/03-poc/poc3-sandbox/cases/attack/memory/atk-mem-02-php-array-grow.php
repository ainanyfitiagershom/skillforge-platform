<?php ini_set("memory_limit","-1");$a=[];for($i=0;$i<10000000;$i++)$a[]=str_repeat("x",100);echo count($a);
