export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const response = await fetch(
    "https://api.replicate.com/v1/predictions/" + id,
    {
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (response.status !== 200) {
    let error = await response.json();
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: "error",
        message: error.detail,
      }),
    };
  }

  const prediction = await response.json();
  return {
    statusCode: 200,
    body: JSON.stringify(prediction),
  };
}
