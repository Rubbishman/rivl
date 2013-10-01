<?php
class Score_model extends CI_Model {

	protected $table = 'score';
	protected $primary_key = 'id';

	public function __construct()
	{
		$this->load->database();
	}

	public function get_score($id = FALSE)
	{
		if ($id === FALSE)
		{
			return FALSE;
		}
		
		$query = $this->db->get_where($this->table, array($this->primary_key => $id));
		return $query->row_array();
	}

	public function save_score($new_data = FALSE) {

		if ($new_data === FALSE) 		{
			return FALSE;
		}

        if ($new_data->id !== null && $new_data->id !== false) {

            $this->db->where($this->primary_key, $id);
            $this->db->update($this->table, $new_data);
            return$new_data->id;

        } else {

            $this->db->insert($this->table, $new_data);
            return $this->db->insert_id();
        }
	}

    public function delete_score($id = FALSE)
	{
		if ($id === FALSE)
		{
			return FALSE;
		}
		
        $this->db->delete($this->table, array($this->primary_key => $id)); 
        return TRUE;
    }


}