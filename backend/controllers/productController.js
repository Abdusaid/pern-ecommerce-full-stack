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
    console.log('product: ', product);
    res.status(200).json({success: true, data: product[0]});
  } catch(error) {
    console.error("Error in getProduct function: ", error);
    res.status(500).json({success: false, message: error.message});
  }
};

export const createProduct = async (req, res) => {
  const {name, price, image} = req.body; // destructuring is possible because we are using express.json() middleware

  if(!name || !price || !image) {
    res.status(400).json({success: false, message: "All fields are required"});
  }

  try {
    const newProduct = await sql `
      INSERT INTO products (name, price, image)
      VALUES (${name}, ${price}, ${image})
      RETURNING *
    `;
    // RETURNING means that we want to return the product that we just inserted to the client back
    console.log('newProduct: ', newProduct);
    res.status(201).json({success: true, data: newProduct[0]}); // status 201 means created - not 200
  } catch(error) {
    console.error("Error in getProduct function: ", error);
    res.status(500).json({success: false, message: error.message});
  }
};

export const updateProduct = async (req, res) => {
  const {id} = req.params;
  const {name, price, image} = req.body;

  try {
    const updateProduct = await sql`
      UPDATE products
      SET name = ${name}, price = ${price}, image = ${image}
      WHERE id = ${id}
      RETURNING *
    `;
    
    if(updateProduct.length === 0) {
      return res.status(404).json({
        success: false, 
        message: "Product not found"
      });
    }
    
    console.log('updateProduct: ', updateProduct);
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

    console.log('deleteProduct: ', deleteProduct);
    res.status(200).json({
      success: true, 
      data: deleteProduct[0]
    });
  } catch(error) {
    console.error("Error in deleteProduct function: ", error);
    res.status(500).json({success: false, message: error.message});
  }
};