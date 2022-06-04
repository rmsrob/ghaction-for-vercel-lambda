import { VercelRequest, VercelResponse } from "@vercel/node";

const handler = async (request: VercelRequest, response: VercelResponse) => {
  try {
    return response.json({
      branch: "develop",
    });
  } catch (error) {
    return response.json({
      data: {
        status: 400,
        response: error,
      },
    });
  }
};

export default handler;
