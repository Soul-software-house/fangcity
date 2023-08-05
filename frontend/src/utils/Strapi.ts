/**
 * Get full Strapi URL from path
 * @param {string} path Path of the URL
 * @returns {string} Full Strapi URL
 */
export function getStrapiURL(path = "") {
    return `${
      process.env.REACT_APP_STRAPI_URL || "http://localhost:1338"
    }${path}`;
  }
  
  