const { globalSearch } = require("../models/searchModel");

/*
|--------------------------------------------------------------------------
| Global Search
|--------------------------------------------------------------------------
*/

exports.search = async (req, res) => {
  try {
    const keyword = (req.query.q || "").trim();

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "Search keyword is required.",
      });
    }

    const results = await globalSearch(
      req.user.id,
      keyword
    );

    return res.json({
      success: true,
      keyword,
      results,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to perform search.",
    });
  }
};