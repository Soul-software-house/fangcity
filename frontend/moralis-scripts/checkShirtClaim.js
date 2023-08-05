Moralis.Cloud.define(
  "checkShirtClaim",
  async request => {
    const user = request?.user;
    const walletAddress = user?.get("ethAddress").toString();

    try {
      const ShirtClaim = new Moralis.Query("ShirtClaim");
      const claims = await ShirtClaim.equalTo("walletAddress", walletAddress).find();

      if (claims?.length > 0) {
        return claims[0];
      } else {
        return null;
      }
    } catch (_) {
      return null;
    }
  },
  {
    fields: [],
    requireUser: true,
  }
);
