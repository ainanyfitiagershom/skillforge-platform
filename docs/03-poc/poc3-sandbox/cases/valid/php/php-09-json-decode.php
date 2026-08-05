<?php
$d=json_decode('{"a":1,"b":[2,3]}',true);
echo $d["b"][1];
