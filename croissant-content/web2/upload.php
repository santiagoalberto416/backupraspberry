<?php
/** APP: Ajax Image uploader with progress bar
    Website:packetcode.com
    Author: Krishna TEja G S
    Date: 29th April 2014
***/
header('Access-Control-Allow-Origin: *');
header('Content-Type: text/javascript; charset=UTF-8');
//header('Access-Control-Allow-Headers: user, token, Origin, X-Requested-With, Content-Type, Accept');
// an array of allowed extensions
$allowedExts = array("gif", "jpeg", "jpg", "png","GIF","JPEG","JPG","PNG");
$temp = explode(".", $_FILES["file"]["name"]);
$extension = end($temp);

//check if the file type is image and then extension
// store the files to upload folder
//echo '0' if there is an error

if ((($_FILES["file"]["type"] == "image/gif")
|| ($_FILES["file"]["type"] == "image/jpeg")
|| ($_FILES["file"]["type"] == "image/jpg")
|| ($_FILES["file"]["type"] == "image/pjpeg")
|| ($_FILES["file"]["type"] == "image/x-png")
|| ($_FILES["file"]["type"] == "image/png"))
&& in_array($extension, $allowedExts)) {
  if ($_FILES["file"]["error"] > 0) {
    echo "0 a";
  } else {
    $target = "/upload/";
    move_uploaded_file($_FILES["file"]["tmp_name"], $target.$_POST['eventid'].'.'.$extension);
    echo  '{ "src" : "/upload/'.$_POST['eventid'].'.'.$extension.'?dummy='.time().'", "name" : "'.$_POST['eventid'].'.'.$extension.'" }';
  }
} else {
  echo "0 b".$_FILES["file"]["type"]." NO NON ONO NO NO NO NO NO N ON ONON NOON ON ON ONON ONON ON ON ON NO ONO NO NON ON ON NO";
}
