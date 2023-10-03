import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import plantumlEncoder from 'plantuml-encoder'
import express from 'express';

// Use import.meta.url to get the module's URL
const __filename = fileURLToPath(import.meta.url);

// Use the path module to extract the directory path
const __dirname = dirname(__filename);

async function createUML(umlText) {
  const encoded = plantumlEncoder.encode(umlText);
  const url = 'http://www.plantuml.com/plantuml/svg/' + encoded;
  console.log(url);

  try {
    const response = await fetch(url);
  
    if (response.status === 200 && response.headers.get('content-type') === 'image/svg+xml') {
      // Assuming the response is SVG content, return it
      const svgText = await response.text();
      console.log('SVG content:\n', svgText);
      return svgText;
    } else {
      console.error('The response is not an SVG.');
      return null; // Return null or handle the error as needed
    }
  } catch (error) {
    console.error('Error fetching the SVG:', error);
    return null; // Return null or handle the error as needed
  }
  
}


const app = express();
const port = 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, images, etc.) from a 'public' directory
app.use(express.static('public'));

// Define a route for the home page
app.get('/', (req, res) => {
  // Specify the correct path to your index.html file
  res.sendFile(__dirname + '/public/index.html');
});

// Handle POST request when the form is submitted
app.post('/submit', async (req, res) => {
  const userInput = req.body.output;

  const pattern = /(@startUML[\s\S]*?@endUML)/i;
  const matches = userInput.match(pattern);

  if (matches) {
    const umlText = matches[1];
    console.log(umlText);

    try {
      const svg = await createUML(umlText);
      res.send(`
        <a style="display: block; width: fit-content; color: white; padding: 10px; background-color: black; margin: 10px; text-decoration: none; font-family: sans-serif;" href="/">Regenerate</a>
        <br>
        ${svg}
      `);
    } catch (error) {
      console.error('Error generating SVG:', error);
      res.status(500).send('Error generating SVG');
    }
  } else {
    console.log("No UML diagram found.");
    res.status(400).send('No UML diagram found in input.');
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
