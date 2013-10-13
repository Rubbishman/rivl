<?php

class Import extends CI_Controller {


    public function __construct() {
        parent::__construct();
        $this->load->model('game_model');
    }

    public function index() {
        echo '<pre>';
        $format = 'd/m/Y';
        $import_data = $this->csv_to_array(APPPATH . 'import/scoresheet.csv');
        foreach ($import_data as $row) {

            //print_r($row,false);

            $date = DateTime::createFromFormat($format, $row['date']);
            $date = $date->format('Y-m-d 00:00:00');

            $dean = array();
            $dean['competitor_id'] = 13;
            $dean['score'] = $row['dean points'];
            $dean['detail'] = $row['dean team'];

            $liam = array();
            $liam['competitor_id'] = 5;
            $liam['score'] = $row['liam points'];
            $liam['detail'] = $row['liam team'];

            if (intval($dean['score']) > intval($liam['score'])) {
                $win_results = $dean;
                $lose_results = $liam;
            } else {
                $win_results = $liam;
                $lose_results = $dean;
            }
            $win_results['rank'] = 1;
            $lose_results['rank'] = 2;

            $game = array();
            $game['competition_id'] = 1;
            $game['date'] = $date;
            $game['results'] = array();

            array_push($game['results'], $win_results);
            array_push($game['results'], $lose_results);

            //print_r($game, false);

            try {
                $game_id = $this->game_model->save_game($game);
            }
            catch (Exception $e) {
                $this->output->set_status_header(500,$e->getMessage());
                $this->output->set_output('DAFAQ'); 
                die();
            }
        }
    }


    function csv_to_array($filename='', $delimiter=',')
    {
        if(!file_exists($filename) || !is_readable($filename))
            return FALSE;

        $header = NULL;
        $data = array();
        if (($handle = fopen($filename, 'r')) !== FALSE)
        {
            while (($row = fgetcsv($handle, 1000, $delimiter)) !== FALSE)
            {
                if(!$header)
                    $header = $row;
                else
                    $data[] = array_combine($header, $row);
            }
            fclose($handle);
        }
        return $data;
    }
}