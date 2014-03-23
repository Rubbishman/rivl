<?php
class Note_model extends CI_Model {

	protected $table_note = 'note';
	protected $table_attach = 'note_attachment';
	protected $primary_key = 'id';

	public function __construct()
	{
		$this->load->database();
	}

	public function save_note($object_type, $object_id, $note) {
		$this->db->insert('note', array('note' => $note));
		$note_id = $this->db->insert_id();
		$this->db->insert('note_attachment',
			array(
				'note_id' => $note_id,
				'object_type' => $object_type,
				'object_id' => $object_id
			)
		);
	}

	public function get_note($object_type, $object_id) {
		$this->db->select('note');
		$this->db->from('note');
		$this->db->join('note_attachment', 'note_attachment.note_id = note.id');
		$this->db->where(array(
			'note_attachment.object_id' => $object_id,
			'note_attachment.object_type' => $object_type));
		$res = $this->db->get();
		return $res->result_array();
	}
}