
const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
app.use(bodyParser.json());


// const swaggerOptions = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "VIT Full Stack Question API",
//       version: "1.0.0",
//       description:
//         "REST API to process arrays and return numbers, alphabets, and special characters",
//     },
//     // servers: [
//     //   { url: "http://localhost:3000" }, 
//     // ],
//     servers: [{ url: "https://testbfhl-a3ghh6i23-nupur1404s-projects.vercel.app" }]
//   },
// //   apis: ["./index.js"], 
//   apis: ["./api/bfhl.js"]
// };

// const swaggerSpec = swaggerJsdoc(swaggerOptions);
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "VIT Full Stack Question API",
      version: "1.0.0",
      description: "REST API with Swagger deployed on Vercel"
    }
  },
  apis: ["./index.js"] // Pulls annotations from bfhl.js
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);


app.use("/", (req, res, next) => {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol;
  const host = req.get("host");

  swaggerSpec.servers = [
    { url: `${protocol}://${host}` }
  ];

  swaggerUi.setup(swaggerSpec)(req, res, next);
}, swaggerUi.serve);



app.post("/bfhl", (req, res) => {
  try {
    const { data } = req.body;
    if (!Array.isArray(data)) {
      return res
        .status(400)
        .json({ is_success: false, message: "Invalid input" });
    }

    const even_numbers = [];
    const odd_numbers = [];
    const alphabets = [];
    const special_characters = [];
    let sum = 0;

    data.forEach((item) => {
      if (!isNaN(item) && item.trim() !== "") {
        const num = parseInt(item, 10);
        if (num % 2 === 0) {
          even_numbers.push(item);
        } else {
          odd_numbers.push(item);
        }
        sum += num;
      } else if (/^[a-zA-Z]+$/.test(item)) {
        alphabets.push(item.toUpperCase());
      } else {
        special_characters.push(item);
      }
    });

    let letters = alphabets.join("");
    let concat_string = "";
    let toggle = true;
    for (let i = letters.length - 1; i >= 0; i--) {
      concat_string += toggle
        ? letters[i].toUpperCase()
        : letters[i].toLowerCase();
      toggle = !toggle;
    }

    const response = {
      is_success: true,
      user_id: "Nupur", 
      email: "nu14123512@gmail.com",
      roll_number: "22bce10381", 
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: sum.toString(),
      concat_string,
    };

    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ is_success: false, message: err.message });
  }
});

module.exports = app;

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(` Server running at http://localhost:${PORT}`);
//   console.log(` Swagger Docs available at http://localhost:${PORT}/api-docs`);
// });
