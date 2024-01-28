export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const response = await fetch(
    "https://api.replicate.com/v1/predictions/" + id,
    {
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (response.status !== 200) {
    let error = await response.json();
    return Response.json(error);
  }

  const prediction = await response.json();
  console.log(prediction);
  return Response.json(prediction);
}
