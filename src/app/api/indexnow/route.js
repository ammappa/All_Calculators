export async function POST(req) {
  const key = "897437f497a24441b51eaa501d2f44e2";

  try {
    const body = await req.json();
    const urls = body.urls;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return new Response(
        JSON.stringify({ error: "No URLs provided" }),
        { status: 400 }
      );
    }

    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        host: "withinsecs.com",
        key: key,
        keyLocation: "https://withinsecs.com/897437f497a24441b51eaa501d2f44e2.txt",
        urlList: urls,
      }),
    });

    const result = await response.text();

    return new Response(
      JSON.stringify({
        success: true,
        result: result,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
