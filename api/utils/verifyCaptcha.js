export async function verifyCaptcha(token) {
  if (!token) return false;

  const params = new URLSearchParams();
  params.append("secret", process.env.HCAPTCHA_SECRET);
  params.append("response", token);

  try {
    const response = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params
    });

    const data = await response.json();
    return data.success === true;
  } catch (err) {
    console.error("hCaptcha verification failed:", err);
    return false;
  }
}
