if (typeof window === 'object') {

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length >= 2) return parts[1].split(';').shift();
  }

  const langParts = getCookie('lang');
  const localeParts = getCookie('client-lang');

  window.__initialization_data__.locale = localeParts || langParts;
}