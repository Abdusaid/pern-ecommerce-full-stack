import {sql} from '../config/db.js';

export const getStudents = async (req, res) => {
  try {
    const students = await sql `
      SELECT * FROM students
      ORDER BY created_at DESC
    `;
    res.status(200).json({success: true, data: students});
  } catch(error) {
    console.error("Error in getStudents function: ", error);
    res.status(500).json({success: false, message: error.message});
  }
};

export const getStudent = async (req, res) => {
  const {id} = req.params; // destructuring is possible because we are using express.json() middleware

  if(!id) {
    res.status(400).json({success: false, message: "ID is required"});
  }

  try {
    const student = await sql `
      SELECT * FROM students
      WHERE id = ${id}
    `;

    if(student.length === 0) {
      return res.status(404).json({success: false, message: "Student not found"});
    }
    res.status(200).json({success: true, data: student[0]});
  } catch(error) {
    console.error("Error in getStudent function: ", error);
    res.status(500).json({success: false, message: error.message});
  }
};

export const createStudent = async (req, res) => {
  const {name, description, image, image_data} = req.body;
  const DEFAULT_IMAGE = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

  if(!name || !description) {
    return res.status(400).json({success: false, message: "Name and description are required"});
  }

  // Validate base64 image size (approximately 5MB)
  if(image_data) {
    // Base64 string size is roughly 4/3 of the original file size
    // 5MB * 1024 * 1024 = 5242880 bytes
    // Base64 equivalent: 5242880 * 4/3 ≈ 6990506 characters
    const maxBase64Size = 6990506;
    if(image_data.length > maxBase64Size) {
      return res.status(400).json({
        success: false,
        message: "Image size exceeds 5MB limit"
      });
    }
  }

  try {
    const newStudent = await sql `
      INSERT INTO students (name, description, image, image_data)
      VALUES (${name}, ${description}, ${image || DEFAULT_IMAGE}, ${image_data || null})
      RETURNING *
    `;
    res.status(201).json({success: true, data: newStudent[0]});
  } catch(error) {
    console.error("Error in createStudent function: ", error);
    res.status(500).json({success: false, message: error.message});
  }
};

export const updateStudent = async (req, res) => {
  const {id} = req.params;
  const {name, description, image, image_data} = req.body;
  const DEFAULT_IMAGE = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

  // Validate base64 image size (approximately 5MB)
  if(image_data) {
    const maxBase64Size = 6990506;
    if(image_data.length > maxBase64Size) {
      return res.status(400).json({
        success: false,
        message: "Image size exceeds 5MB limit"
      });
    }
  }

  try {
    const updateStudent = await sql`
      UPDATE students
      SET name = ${name}, description = ${description}, image = ${image || DEFAULT_IMAGE}, image_data = ${image_data || null}
      WHERE id = ${id}
      RETURNING *
    `;
    if(updateStudent.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }
    res.status(200).json({
      success: true,
      data: updateStudent[0]
    });
  } catch(error) {
    console.error("Error in updateStudent function: ", error);
    res.status(500).json({success: false, message: error.message});
  }
};

export const deleteStudent = async (req, res) => {
  const {id} = req.params;

  try {
    const deleteStudent = await sql`
      DELETE FROM students
      WHERE id = ${id}
      RETURNING *
    `;

    if(deleteStudent.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.status(200).json({
      success: true,
      data: deleteStudent[0]
    });
  } catch(error) {
    console.error("Error in deleteStudent function: ", error);
    res.status(500).json({success: false, message: error.message});
  }
};