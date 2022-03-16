<?php
if (!isset($_ENV['INCLUDE_PATHS'])) $_ENV['INCLUDE_PATHS'] = [];
$_ENV['INCLUDE_PATHS'][] = __DIR__;
$_ENV['INCLUDE_PATHS'][] = dirname(__DIR__) . "/apipublic/manager/gc-devsdk";
require_once(dirname(__DIR__) . "/apipublic/manager/gc-sdk/autoload.php");
require_once(dirname(__DIR__) . "/GitHub/serverapi/vendor/autoload.php");