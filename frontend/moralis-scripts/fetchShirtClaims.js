Moralis.Cloud.define(
  "fetchShirtClaims",
  async request => {
    try {
      const ShirtClaim = new Moralis.Query("ShirtClaim");
      const claims = await ShirtClaim.find();

      return claims;
    } catch (_) {
      return null;
    }
  },
  {
    fields: [],
    requireUser: true,
  }
);
