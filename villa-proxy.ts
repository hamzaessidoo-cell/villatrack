import type { Context, Config } from "@netlify/edge-functions";

export default async (req: Request, context: Context) => {
  // GET الـ target URL من الطلب
  const url = new URL(req.url);
  const targetUrl = url.searchParams.get("target");

  if (!targetUrl) {
    return new Response(
      JSON.stringify({ success: false, message: "No target URL provided" }),
      { 
        status: 400, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }

  try {
    // نوجه الطلب إلى Supabase
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "apikey": req.headers.get("apikey") || "",
        "Authorization": req.headers.get("Authorization") || "",
      },
      body: req.body,
    });

    const responseText = await response.text();
    let responseData;

    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = { success: false, message: "Invalid response from server" };
    }

    return new Response(JSON.stringify(responseData), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message || "Proxy error" 
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
};

export const config: Config = {
  path: "/api/villa-proxy",
};
