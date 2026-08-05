<?php
$r=[["id"=>1,"n"=>"a"],["id"=>2,"n"=>"b"],["id"=>3,"n"=>"c"]];
echo implode(",",array_column($r,"n"));
