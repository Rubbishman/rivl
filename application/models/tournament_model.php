<?php
class Tournament_model extends CI_Model {

    public function __construct()
    {
        $this->load->database();
    }

    public function get_tournament($id = FALSE)
    {
        if ($id === FALSE)
        {
            return FALSE;
        }

        $query = $this->db->get_where('tournament', array('tournament.id' => $id));
        return $query->row_array();
    }

    public function get_tournaments($params = FALSE)
    {
        foreach ($params as $key => $value) {
            $this->db->where('tournament.'.$key, $value);
        }

        $query = $this->db->get('tournament');
        return $query->result();
    }

    public function save_tournament($new_data = FALSE) {

        if ($new_data === FALSE) {
            return FALSE;
        }

        if ($new_data->id !== null && $new_data->id !== false) {

            $this->db->where('tournament.id', $id);
            $this->db->update('tournament', $new_data);
            return $new_data->id;

        } else {

            $this->db->insert('tournament', $new_data);
            return $this->db->insert_id();
        }
    }

    public function delete_tournament($id = FALSE)
    {
        if ($id === FALSE)
        {
            return FALSE;
        }

        $this->db->delete('tournament', array('tournament.id' => $id));
        return TRUE;
    }


}