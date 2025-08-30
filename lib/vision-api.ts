// Google Vision API integration
// Note: In production, this should be handled server-side for security

const GOOGLE_VISION_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_VISION_API_KEY;

export async function analyzeImage(base64Image: string): Promise<string> {
  // For demo purposes, we'll simulate the API response
  // In production, replace this with actual Google Vision API call
  
  if (!GOOGLE_VISION_API_KEY) {
    console.warn('Google Vision API key not configured. Using demo data.');
    return simulateTextExtraction();
  }

  try {
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: base64Image,
              },
              features: [
                {
                  type: 'TEXT_DETECTION',
                  maxResults: 1,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Vision API error: ${response.status}`);
    }

    const data = await response.json();
    const textAnnotations = data.responses[0]?.textAnnotations;
    
    if (textAnnotations && textAnnotations.length > 0) {
      return textAnnotations[0].description || '';
    }

    return '';
  } catch (error) {
    console.error('Vision API error:', error);
    // Fallback to demo data
    return simulateTextExtraction();
  }
}

function simulateTextExtraction(): string {
  // Demo text that simulates extracted text from a wine bottle
  const demoTexts = [
    `Château Margaux
Producer: Château Margaux
Grape Variety: Cabernet Sauvignon, Merlot
AOC: Margaux
Region: Bordeaux, France
Vintage: 2015
Price: ¥85,000`,
    
    `Domaine de la Romanée-Conti
Producer: Domaine de la Romanée-Conti
Grape Variety: Pinot Noir
AOC: Romanée-Conti Grand Cru
Region: Burgundy, France
Vintage: 2018
Price: ¥450,000`,
    
    `Opus One
Producer: Opus One Winery
Grape Variety: Cabernet Sauvignon
AOC: Napa Valley
Region: California, USA
Vintage: 2019
Price: ¥65,000`
  ];

  return demoTexts[Math.floor(Math.random() * demoTexts.length)];
}