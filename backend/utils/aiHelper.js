const axios = require("axios");

exports.generateCourseDescription = async (title) => {

 const response = await axios.post(
   "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
   {
     contents: [{ parts: [{ text: `Write course description for ${title}` }] }]
   },
   {
     params: { key: process.env.GEMINI_API_KEY }
   }
 );

 return response.data;
};