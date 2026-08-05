<?php
echo implode(",",array_filter([1,2,3,4,5,6],fn($x)=>$x%2==0));
