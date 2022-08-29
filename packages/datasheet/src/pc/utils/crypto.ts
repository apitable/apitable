export const digest = async(message: string, algorithm = 'SHA-256') =>
  Array.prototype.map
    .call(
      new Uint8Array(
        await crypto.subtle.digest(algorithm, new TextEncoder().encode(message))
      ),
      (x) => ('0' + x.toString(16)).slice(-2)
    )
    .join('');
