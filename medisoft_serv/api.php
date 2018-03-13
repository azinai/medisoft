<?php
header('Access-Control-Allow-Origin: *');

$POST = json_decode(file_get_contents('php://input'));

$message = $POST->message;
$context = $POST->context;

    // Identifiant Workspace
    $workspace_id = 'e2466eef-bd8a-489b-b122-a371464c6f82';
    // Date de création du module
    $release_date = '2018-02-27';
    // Username
    $username = '8c3f6dd4-2b0c-4ac5-a3cd-b41ce6505916';
    // Password
    $password = 'jqTx2Xxcqzl6';

    // Make a request message for Watson API in json.
    $data['input']['text'] = $message;
    if(isset($context) && $context){
        $data['context'] = json_decode($context, JSON_UNESCAPED_UNICODE);
    }
    $data['alternate_intents'] = false;
    $json = json_encode($data, JSON_UNESCAPED_UNICODE);

    // Post the json to the Watson API via cURL.
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, 'https://watson-api-explorer.mybluemix.net/conversation/api/v1/workspaces/'.$workspace_id.'/message?version='.$release_date);
    curl_setopt($ch, CURLOPT_USERPWD, $username.":".$password);
    curl_setopt($ch, CURLOPT_POST, true );
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
    $result = trim( curl_exec( $ch ) );
    curl_close($ch);

    // Responce the result.
    echo $result;
