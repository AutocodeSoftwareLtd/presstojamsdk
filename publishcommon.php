<?php
require(__DIR__ . "/config.php");

$aws_config = new \GC\Core\Configs\AWS();
$aws_config->public = true;
$aws_config->resource = "presstojam.com";

$aws_config_cloud = new \GC\Core\Configs\AWS();
$aws_config_cloud->resource = "E3UEERYK2H1OZF";

\GC\Core\Configs\GlobalConfigs::s()->register("aws", "cloudfront", $aws_config_cloud);

$cmd = "vue build  --target wc --name ptj";
$cmd = "npm run build";
echo "\n" . $cmd;
$res=exec($cmd);

/*
file_put_contents(dirname(dirname(dirname(__DIR__))) . "/apipublic/manager/services/repos/presstojam.com/public/script/gc.min.js", file_get_contents(__DIR__ . "/dist/gc.min.js"));
file_put_contents(dirname(dirname(dirname(__DIR__))) . "/apipublic/manager/services/repos/presstojam.com/public/script/vue.js", file_get_contents(__DIR__ . "/dist/vue.js"));

file_put_contents(dirname(dirname(dirname(__DIR__))) . "/petinsure-default/crm/js/gc.min.js", file_get_contents(__DIR__ . "/dist/gc.min.js"));
file_put_contents(dirname(dirname(dirname(__DIR__))) . "/petinsure-default/crm/js/vue.js", file_get_contents(__DIR__ . "/dist/vue.js"));
*/

$files=array("script/gc.min.js"=>"dist/gc.min.js", "script/gc.min.js.map" => "dist/gc.min.js.map", "script/vue.js" => "dist/vue.js", "style/sdk-styles.css"=>"vite-sdk/style.css");
$paths=array();
foreach($files as $key=>$filename) {
    $paths[$key] = file_get_contents(__DIR__ . "/" . $filename);
}

$host = new \Services\Writers\AmazonS3Host($aws_config);
$host->pushBatch($paths);
