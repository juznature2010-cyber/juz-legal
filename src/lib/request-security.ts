function hostsMatch(a: string, b: string) {
  return a.toLowerCase() === b.toLowerCase();
}

function hostFromUrl(value: string) {
  try {
    return new URL(value).host;
  } catch {
    return null;
  }
}

export function isTrustedFormRequest(request: Request) {
  const requestHost = hostFromUrl(request.url);
  if (!requestHost) return false;

  const origin = request.headers.get("origin");
  if (origin) {
    const originHost = hostFromUrl(origin);
    return !!originHost && hostsMatch(originHost, requestHost);
  }

  const referer = request.headers.get("referer");
  if (referer) {
    const refererHost = hostFromUrl(referer);
    return !!refererHost && hostsMatch(refererHost, requestHost);
  }

  return false;
}
