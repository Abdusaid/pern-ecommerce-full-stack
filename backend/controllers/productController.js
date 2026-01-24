import {sql} from '../config/db.js';

export const getProducts = async (req, res) => {
  try {
    const products = await sql `
      SELECT * FROM products
      ORDER BY created_at DESC
    `;
    res.status(200).json({success: true, data: products});
  } catch(error) {
    console.error("Error in getProducts function: ", error);
    res.status(500).json({success: false, message: error.message});
  }
};

export const getProduct = async (req, res) => {
  const {id} = req.params; // destructuring is possible because we are using express.json() middleware

  if(!id) {
    res.status(400).json({success: false, message: "ID is required"});
  }

  try {
    const product = await sql `
      SELECT * FROM products
      WHERE id = ${id}
    `;

    if(product.length === 0) {
      return res.status(404).json({success: false, message: "Product not found"});
    }
    res.status(200).json({success: true, data: product[0]});
  } catch(error) {
    console.error("Error in getProduct function: ", error);
    res.status(500).json({success: false, message: error.message});
  }
};

export const createProduct = async (req, res) => {
  const {name, price, image, image_data} = req.body;

  if(!name || !price) {
    return res.status(400).json({success: false, message: "Name and price are required"});
  }

  if(!image && !image_data) {
    return res.status(400).json({success: false, message: "Either image URL or image file is required"});
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
    const newProduct = await sql `
      INSERT INTO products (name, price, image, image_data)
      VALUES (${name}, ${price}, ${image || ''}, ${image_data || null})
      RETURNING *
    `;
    res.status(201).json({success: true, data: newProduct[0]});
  } catch(error) {
    console.error("Error in createProduct function: ", error);
    res.status(500).json({success: false, message: error.message});
  }
};

export const updateProduct = async (req, res) => {
  const {id} = req.params;
  const {name, price, image, image_data} = req.body;
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
    const updateProduct = await sql`
      UPDATE products
      SET name = ${name}, price = ${price}, image = ${image || ''}, image_data = ${image_data || null}
      WHERE id = ${id}
      RETURNING *
    `;
    if(updateProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    res.status(200).json({
      success: true,
      data: updateProduct[0]
    });
  } catch(error) {
    console.error("Error in updateProduct function: ", error);
    res.status(500).json({success: false, message: error.message});
  }
};

export const deleteProduct = async (req, res) => {
  const {id} = req.params;

  try {
    const deleteProduct = await sql`
      DELETE FROM products
      WHERE id = ${id}
      RETURNING *
    `;

    if(deleteProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      data: deleteProduct[0]
    });
  } catch(error) {
    console.error("Error in deleteProduct function: ", error);
    res.status(500).json({success: false, message: error.message});
  }
};