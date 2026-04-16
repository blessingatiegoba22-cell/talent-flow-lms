import { cookies } from "next/headers";

type CookieOptions = {
  expires?: Date;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: "lax" | "strict" | "none";
  secure?: boolean;
};

export function getSetCookieHeaders(headers: Headers) {
  const withGetSetCookie = headers as Headers & {
    getSetCookie?: () => string[];
  };
  const setCookies = withGetSetCookie.getSetCookie?.();

  if (setCookies?.length) {
    return setCookies;
  }

  const header = headers.get("set-cookie");

  if (!header) {
    return [];
  }

  return header
    .split(/,(?=\s*[^;,]+=)/g)
    .map((cookie) => cookie.trim())
    .filter(Boolean);
}

export async function getRequestCookieHeader() {
  return (await cookies()).toString();
}

export async function storeBackendCookies(headers: Headers) {
  const cookieStore = await cookies();

  for (const header of getSetCookieHeaders(headers)) {
    const parsedCookie = parseSetCookie(header);

    if (!parsedCookie) {
      continue;
    }

    cookieStore.set(parsedCookie.name, parsedCookie.value, parsedCookie.options);
  }
}

function removeCookieDomain(header: string) {
  return header
    .split(";")
    .map((part) => part.trim())
    .filter((part) => part && !part.toLowerCase().startsWith("domain="))
    .join("; ");
}

function parseSetCookie(header: string) {
  const cleanHeader = removeCookieDomain(header);
  const [nameValue, ...attributes] = cleanHeader
    .split(";")
    .map((part) => part.trim());
  const separatorIndex = nameValue.indexOf("=");

  if (separatorIndex <= 0) {
    return null;
  }

  const options: CookieOptions = {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };
  const name = nameValue.slice(0, separatorIndex);
  const value = nameValue.slice(separatorIndex + 1);

  for (const attribute of attributes) {
    const [rawKey, ...rawValueParts] = attribute.split("=");
    const key = rawKey.toLowerCase();
    const attributeValue = rawValueParts.join("=");

    if (key === "expires") {
      const expires = new Date(attributeValue);

      if (!Number.isNaN(expires.getTime())) {
        options.expires = expires;
      }
    }

    if (key === "httponly") {
      options.httpOnly = true;
    }

    if (key === "max-age") {
      const maxAge = Number(attributeValue);

      if (Number.isFinite(maxAge)) {
        options.maxAge = maxAge;
      }
    }

    if (key === "path") {
      options.path = attributeValue || "/";
    }

    if (key === "samesite") {
      const sameSite = attributeValue.toLowerCase();

      if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
        options.sameSite = sameSite;
      }
    }

    if (key === "secure") {
      options.secure = true;
    }
  }

  return {
    name,
    options,
    value,
  };
}
