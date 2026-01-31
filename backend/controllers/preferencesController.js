import {sql} from '../config/db.js';

// Global theme ID (we only store one theme for the entire app)
const GLOBAL_THEME_ID = 'global';

export const getGlobalTheme = async (req, res) => {
  try {
    const preferences = await sql `
      SELECT * FROM user_preferences
      WHERE user_id = ${GLOBAL_THEME_ID}
    `;

    if(preferences.length === 0) {
      // Return default theme if none exist
      return res.status(200).json({
        success: true,
        data: {
          theme: 'business'
        }
      });
    }

    res.status(200).json({success: true, data: preferences[0]});
  } catch(error) {
    console.error("Error in getGlobalTheme function: ", error);
    res.status(500).json({success: false, message: error.message});
  }
};

export const updateGlobalTheme = async (req, res) => {
  const {theme} = req.body;

  if(!theme) {
    return res.status(400).json({success: false, message: "Theme is required"});
  }

  try {
    // Check if global theme preference exists
    const existing = await sql `
      SELECT * FROM user_preferences
      WHERE user_id = ${GLOBAL_THEME_ID}
    `;

    let result;
    if(existing.length === 0) {
      // Insert new global theme
      result = await sql `
        INSERT INTO user_preferences (user_id, theme)
        VALUES (${GLOBAL_THEME_ID}, ${theme})
        RETURNING *
      `;
    } else {
      // Update existing global theme
      result = await sql `
        UPDATE user_preferences
        SET theme = ${theme}, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${GLOBAL_THEME_ID}
        RETURNING *
      `;
    }

    res.status(200).json({success: true, data: result[0]});
  } catch(error) {
    console.error("Error in updateGlobalTheme function: ", error);
    res.status(500).json({success: false, message: error.message});
  }
};
