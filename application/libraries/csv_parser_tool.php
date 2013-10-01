<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class csv_parser_tool{
	public function parse_csv($file,$comma=',',$quote='"',$newline="\n") {

	    $db_quote = $quote . $quote;

	    // Clean up file
	    $file = trim($file);
	    $file = str_replace("\r\n",$newline,$file);

	    $file = str_replace($db_quote,'&quot;',$file); // replace double quotes with &quot; HTML entities
	    $file = str_replace(',&quot;,',',,',$file); // handle ,"", empty cells correctly

	    $file .= $comma; // Put a comma on the end, so we parse last cell


	    $inquotes = false;
	    $start_point = 0;
	    $row = 0;
	    $word = 0;
	    for($i=0; $i<strlen($file); $i++) {

	        $char = $file[$i];
	        if ($char == $quote) {
	            if ($inquotes) {
	                $inquotes = false;
	                }
	            else {
	                $inquotes = true;
	                }
	            }

	        if (($char == $comma or $char == $newline) and !$inquotes) {

	            $cell = substr($file,$start_point,$i-$start_point);
	            $cell = str_replace($quote,'',$cell); // Remove delimiter quotes
	            $cell = str_replace('&quot;',$quote,$cell); // Add in data quotes
	            if(strcasecmp(strtolower($cell), 'null') ==0){
	            	$cell ='';
	            }
	            if($row==0){
	                $cell = strtolower($cell);
	            	$header[] = $cell;
	            }

	            $data[$row][$header[$word]] = $cell;

	            $word++;
	            $start_point = $i + 1;
	            if ($char == $newline) {
	                $row ++;
	                $word = 0;
	                }
	            }

	        }

	    return $data;
	}
}