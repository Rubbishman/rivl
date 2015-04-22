<?php
class Competition_model extends CI_Model {

	public function __construct()
	{
		$this->load->database();
	}

	public function get_competition($id = FALSE)
	{
		if ($id === FALSE)
		{
			return FALSE;
		}
		
		$query = $this->db->get_where('competition', array('competition.id' => $id));

        $result = $query->row_array();

        $query = $this->db->get_where('competition', array('parent' => $id));
        $result['children'] = $query->result_array();
        return $result;
	}

	public function get_root_competitions($params = FALSE)
	{
		foreach ($params as $key => $value) {
			$this->db->where('competition.'.$key, $value);
		}
        $this->db->where('parent', NULL);
		$query = $this->db->get('competition');
		return $query->result();
	}

	public function save_competition($new_data = FALSE) {

		if ($new_data === FALSE) {
			return FALSE;
		}

        if ($new_data->id !== null && $new_data->id !== false) {

            $this->db->where('competition.id', $id);
            $this->db->update('competition', $new_data);
            return $new_data->id;

        } else {

            $this->db->insert('competition', $new_data);
            return $this->db->insert_id();
        }
	}

    public function delete_competition($id = FALSE)
	{
		if ($id === FALSE)
		{
			return FALSE;
		}
		
        $this->db->delete('competition', array('competition.id' => $id)); 
        return TRUE;
    }


}